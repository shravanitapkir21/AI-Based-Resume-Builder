from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ---------------------------
# DATA MODEL
# ---------------------------
class SkillRequest(BaseModel):
    domain: str
    skills: list = []

# ---------------------------
# SAMPLE DOMAIN → SKILLS MAP
# ---------------------------
SKILL_DATABASE = {
    "Web Development": [
        "HTML", "CSS", "JavaScript", "React.js", "Node.js",
        "Express.js", "MongoDB", "Git", "Responsive Design"
    ],
    "Cybersecurity": [
        "Networking Basics", "Linux", "Nmap", "Burp Suite",
        "Metasploit", "OWASP Top 10", "Firewalls", "SIEM Tools"
    ],
    "Data Science": [
        "Python", "Pandas", "NumPy", "Machine Learning",
        "Data Visualization", "TensorFlow", "Deep Learning"
    ],
    "Cloud Engineer": [
        "AWS", "Azure", "Google Cloud", "Docker",
        "Kubernetes", "CI/CD", "Terraform"
    ],
    "Software Engineer": [
        "Java", "OOP", "DSA", "SQL", "Spring Boot",
        "REST APIs", "Microservices"
    ],
    "Data Analyst": [
        "Excel", "SQL", "Power BI", "Tableau",
        "Python", "Data Cleaning", "Visualization"
    ],
    "Software Tester": [
        "Manual Testing", "Automation Testing", "Selenium",
        "Test Cases", "Bug Tracking Tools"
    ],
    "Network Engineer": [
        "CCNA", "Routing", "Switching", "Subnets",
        "Firewalls", "VPN", "Network Security"
    ],
    "Mechanical Engineer": [
        "AutoCAD", "SolidWorks", "Thermodynamics",
        "Manufacturing Processes", "MATLAB"
    ],
    "Electronics Engineer": [
        "PCB Design", "Embedded Systems", "Microcontrollers",
        "Digital Electronics", "Arduino", "VHDL"
    ]
}

# ---------------------------
# FASTAPI APP
# ---------------------------
app = FastAPI()

# ---------------------------
# CORS (to allow frontend calls)
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# API: SUGGEST SKILLS
# ---------------------------
@app.post("/suggest-skills")
async def suggest_skills(request: SkillRequest):
    domain = request.domain

    # Fetch skills
    skills = SKILL_DATABASE.get(domain, ["No skills available for this domain"])

    return {
        "domain": domain,
        "suggestions": skills
    }

# ---------------------------
# API: SAVE SKILLS (Mock)
# ---------------------------
@app.post("/save")
async def save_skills(request: SkillRequest):
    print("Saved to database (demo):", request.dict())
    return {"status": "success", "message": "Saved successfully!"}
