import os
import sys

# Add the backend directory to the path so we can import modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from database.db import edu_content_col, init_db

print("Dropping existing educational_content collection...")
edu_content_col.drop()
print("Re-initializing DB to seed articles...")
init_db()
print("Done!")
