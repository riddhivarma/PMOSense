# backend/controllers/cycle_controller.py
import datetime
import uuid
import io
from flask import jsonify, request, send_file
from flask_jwt_extended import get_jwt_identity
from database.db import cycles_col, users_col
from utils.cycle_report_generator import generate_cycle_pdf_report

class CycleController:
    @staticmethod
    def _compute_cycle_stats(cycles):
        """
        Computes average cycle length, regularity, and predicted next period.
        """
        if not cycles:
            return {
                "avg_cycle_length": None,
                "cycle_regularity": "No records logged yet",
                "next_predicted_period": None,
                "total_logged": 0,
                "avg_duration": None
            }
        
        # Sort by start_date ascending
        sorted_cycles = sorted(cycles, key=lambda x: str(x.get('start_date', '')))
        
        durations = [int(c.get('period_duration', 5)) for c in sorted_cycles if c.get('period_duration')]
        avg_dur = round(sum(durations) / len(durations), 1) if durations else 5.0
        
        if len(sorted_cycles) < 2:
            try:
                first_date = datetime.date.fromisoformat(sorted_cycles[0]['start_date'])
                next_pred = (first_date + datetime.timedelta(days=28)).isoformat()
            except Exception:
                next_pred = None
            return {
                "avg_cycle_length": 28.0,
                "cycle_regularity": "Regular (Baseline single cycle)",
                "next_predicted_period": next_pred,
                "total_logged": 1,
                "avg_duration": avg_dur
            }
        
        # Compute intervals between start dates
        intervals = []
        for i in range(1, len(sorted_cycles)):
            try:
                d1 = datetime.date.fromisoformat(sorted_cycles[i-1]['start_date'])
                d2 = datetime.date.fromisoformat(sorted_cycles[i]['start_date'])
                diff = (d2 - d1).days
                if diff > 0:
                    intervals.append(diff)
            except Exception:
                continue
                
        if not intervals:
            avg_len = 28.0
            regularity = "Regular (Baseline)"
        else:
            avg_len = round(sum(intervals) / len(intervals), 1)
            # Evaluate regularity (Rotterdam threshold: 21 to 35 days)
            if avg_len > 35:
                regularity = "Irregular (Oligomenorrhea tendency)"
            elif avg_len < 21:
                regularity = "Irregular (Polymenorrhea tendency)"
            else:
                regularity = "Regular (21 - 35 days)"
                
        # Predict next period based on last logged cycle
        try:
            last_date = datetime.date.fromisoformat(sorted_cycles[-1]['start_date'])
            next_pred = (last_date + datetime.timedelta(days=int(avg_len or 28))).isoformat()
        except Exception:
            next_pred = None
            
        return {
            "avg_cycle_length": avg_len,
            "cycle_regularity": regularity,
            "next_predicted_period": next_pred,
            "total_logged": len(sorted_cycles),
            "avg_duration": avg_dur
        }

    @staticmethod
    def log_cycle():
        """POST /api/cycle - Create or update a cycle log"""
        try:
            user_id = get_jwt_identity()
            data = request.get_json() or {}
            
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            flow = data.get('flow', 'Medium')
            pain_level = data.get('pain_level', 2)
            pads_per_day = data.get('pads_per_day', 3)
            additional_issues = data.get('additional_issues', '')
            
            if not start_date:
                return jsonify({"message": "Start date of menstruation is required."}), 422
                
            try:
                start_obj = datetime.date.fromisoformat(start_date)
            except ValueError:
                return jsonify({"message": "Invalid start date format. Expected YYYY-MM-DD."}), 422
                
            period_duration = 5
            if end_date and str(end_date).strip():
                try:
                    end_obj = datetime.date.fromisoformat(str(end_date).strip())
                    if end_obj < start_obj:
                        return jsonify({"message": "End date cannot be prior to start date."}), 422
                    period_duration = (end_obj - start_obj).days + 1
                    end_date = end_obj.isoformat()
                except ValueError:
                    return jsonify({"message": "Invalid end date format. Expected YYYY-MM-DD."}), 422
            else:
                # Default 5-day cycle duration rule (+4 days from start date to make 5 bleeding days)
                period_duration = 5
                end_obj = start_obj + datetime.timedelta(days=4)
                end_date = end_obj.isoformat()
                    
            try:
                pain_level = int(pain_level)
                if pain_level < 1 or pain_level > 5:
                    pain_level = 2
            except (ValueError, TypeError):
                pain_level = 2
                
            try:
                pads_per_day = int(pads_per_day)
                if pads_per_day < 1:
                    pads_per_day = 1
            except (ValueError, TypeError):
                pads_per_day = 3
                
            month_name = start_obj.strftime("%B %Y")
            
            # Check if an existing log matches this start_date or month for the user
            existing = cycles_col.find_one({"user_id": user_id, "start_date": start_date})
            
            if existing:
                cycle_id = existing.get('cycle_id')
                cycles_col.update_one(
                    {"cycle_id": cycle_id},
                    {"$set": {
                        "end_date": end_date,
                        "period_duration": period_duration,
                        "flow": flow,
                        "pain_level": pain_level,
                        "pads_per_day": pads_per_day,
                        "additional_issues": additional_issues,
                        "month_name": month_name,
                        "updated_at": datetime.datetime.utcnow()
                    }}
                )
                msg = "Cycle log updated successfully."
            else:
                cycle_id = f"cyc-{str(uuid.uuid4())[:8]}"
                new_cycle = {
                    "cycle_id": cycle_id,
                    "user_id": user_id,
                    "start_date": start_date,
                    "end_date": end_date,
                    "period_duration": period_duration,
                    "flow": flow,
                    "pain_level": pain_level,
                    "pads_per_day": pads_per_day,
                    "additional_issues": additional_issues,
                    "month_name": month_name,
                    "created_at": datetime.datetime.utcnow()
                }
                cycles_col.insert_one(new_cycle)
                msg = "Cycle logged successfully."
                
            # Retrieve updated full list and stats
            all_cycles = list(cycles_col.find({"user_id": user_id}, {"_id": 0}))
            stats = CycleController._compute_cycle_stats(all_cycles)
            
            return jsonify({
                "message": msg,
                "cycle_id": cycle_id,
                "stats": stats
            }), 200
            
        except Exception as e:
            return jsonify({"message": "Error saving cycle details.", "error": str(e)}), 500

    @staticmethod
    def get_user_cycles():
        """GET /api/cycle - Retrieve all logged cycles and calculated analytics"""
        try:
            user_id = get_jwt_identity()
            cycles = list(cycles_col.find({"user_id": user_id}, {"_id": 0}).sort("start_date", -1))
            
            # Ensure every cycle has an end_date (default 5-day rule if previously null)
            for c in cycles:
                if not c.get('end_date') and c.get('start_date'):
                    try:
                        s_obj = datetime.date.fromisoformat(c['start_date'])
                        dur = int(c.get('period_duration') or 5)
                        calc_end = (s_obj + datetime.timedelta(days=dur - 1)).isoformat()
                        c['end_date'] = calc_end
                        cycles_col.update_one(
                            {"cycle_id": c.get('cycle_id')},
                            {"$set": {"end_date": calc_end, "period_duration": dur}}
                        )
                    except Exception:
                        pass

            stats = CycleController._compute_cycle_stats(cycles)
            
            return jsonify({
                "cycles": cycles,
                "stats": stats
            }), 200
        except Exception as e:
            return jsonify({"message": "Error fetching cycle history.", "error": str(e)}), 500

    @staticmethod
    def delete_cycle(id):
        """DELETE /api/cycle/<id> - Delete a cycle record"""
        try:
            user_id = get_jwt_identity()
            result = cycles_col.delete_one({"cycle_id": id, "user_id": user_id})
            if result.deleted_count == 0:
                return jsonify({"message": "Cycle log record not found."}), 404
                
            all_cycles = list(cycles_col.find({"user_id": user_id}, {"_id": 0}))
            stats = CycleController._compute_cycle_stats(all_cycles)
            
            return jsonify({
                "message": "Cycle log successfully removed.",
                "stats": stats
            }), 200
        except Exception as e:
            return jsonify({"message": "Error deleting cycle record.", "error": str(e)}), 500

    @staticmethod
    def generate_cycle_pdf():
        """GET /api/cycle/pdf - Generate and download 6-month cycle report"""
        try:
            user_id = get_jwt_identity()
            user = users_col.find_one({"user_id": user_id})
            if not user:
                return jsonify({"message": "User not found."}), 404
                
            user_name = user.get("name", "Patient")
            user_email = user.get("email", "patient@example.com")
            user_info = {
                "age": user.get("age", "N/A"),
                "blood_group": user.get("blood_group", "Not set")
            }
            
            # Fetch all user cycles
            all_cycles = list(cycles_col.find({"user_id": user_id}, {"_id": 0}).sort("start_date", 1))
            
            # Filter cycles within the last 6 months (approx 185 days)
            now = datetime.date.today()
            six_months_ago = now - datetime.timedelta(days=185)
            
            recent_cycles = []
            for c in all_cycles:
                try:
                    s_date = datetime.date.fromisoformat(c.get('start_date'))
                    if s_date >= six_months_ago:
                        recent_cycles.append(c)
                except Exception:
                    continue
                    
            # If fewer than 6 months recorded, include up to the last 6 cycles available
            if not recent_cycles and all_cycles:
                recent_cycles = all_cycles[-6:]
                
            stats = CycleController._compute_cycle_stats(recent_cycles or all_cycles)
            
            pdf_buffer = io.BytesIO()
            generate_cycle_pdf_report(
                user_name=user_name,
                user_email=user_email,
                user_info=user_info,
                cycles=recent_cycles,
                stats=stats,
                output_path=pdf_buffer
            )
            pdf_buffer.seek(0)
            
            safe_name = user_name.replace(" ", "_")
            return send_file(
                pdf_buffer,
                as_attachment=True,
                download_name=f"PMOSense_Cycle_History_{safe_name}.pdf",
                mimetype='application/pdf'
            )
        except Exception as e:
            return jsonify({"message": "Error generating cycle history report.", "error": str(e)}), 500
