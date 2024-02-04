import requests, logging
from bs4 import BeautifulSoup
    
def get_professor_profiles(last_name, first_name, dept):
    base_url = "https://directory.tamu.edu"
    search_url = f"{base_url}/?branch=people&cn={last_name}+{first_name}"
    try:
        response = requests.get(search_url, timeout=60)
    except Exception as e:
        logging.error(f"Timeout error when getting name for {first_name} {last_name}: {e}")
        return {"error": f"Timeout error when getting name for {first_name} {last_name}: {e}"}

    soup = BeautifulSoup(response.text, 'html.parser')
    faculty_divs = soup.find_all('div', class_='result-listing fac_staff')
    
    depts = {
    "AALO": "Arabic & Asian Language",
    "ACCT": "Accounting",
    "AERO": "Aerospace Engineering",
    "AERS": "Aerospace Studies",
    "AFST": "Africana Studies",
    "AGCJ": "Ag Comm & Journalism",
    "AGEC": "Agricultural Economics",
    "AGLS": "Ag & Life Sciences",
    "AGSC": "Agricultural Science",
    "AGSM": "Agricultrl Systems Mgmt",
    "ALEC": "Ag Leadrshp, Ed & Comm",
    "ALED": "Ag Leadership & Dev",
    "ANSC": "Animal Science",
    "ANTH": "Anthropology",
    "ARAB": "Arabic",
    "ARCH": "Architecture",
    "AREN": "Architectural Engr",
    "ARSC": "Arts & Sciences",
    "ARTS": "Art",
    "ASCC": "Academic Success Center",
    "ASIA": "Asian Studies",
    "ASTR": "Astronomy",
    "ATMO": "Atmospheric Sciences",
    "ATTR": "Athletic Training",
    "BAEN": "Biological & Ag Engr",
    "BEFB": "Bilingual Ed Field Based",
    "BESC": "Bioenvironmental Sci",
    "BICH": "Biochemistry",
    "BIMS": "Biomedical Science",
    "BIOL": "Biology",
    "BMEN": "Biomedical Engineering",
    "BOTN": "Botany",
    "BUSH": "Geo Bush School of Gov",
    "BUSN": "Mays Business School",
    "CARC": "College of Architecture",
    "CEHD": "Coll of Ed & Human Dev",
    "CHEM": "Chemistry",
    "CHEN": "Chemical Engineering",
    "CHIN": "Chinese",
    "CLAS": "Classics",
    "CLEN": "College of Engineering",
    "COMM": "Communication",
    "COSC": "Construction Science",
    "CSCE": "Computer Sci & Engr",
    "CVEN": "Civil Engineering",
    "CYBR": "Cybersecurity",
    "DAEN": "Data Engineering",
    "DASC": "Dairy Science",
    "DCED": "Dance Education",
    "DDHS": "Dental Hygiene",
    "DIVE": "Diving Tech and Methods",
    "ECCB": "Eco & Conservation Biol",
    "ECEN": "Electrical & Comp Engr",
    "ECHE": "Early Chldhd Ed Fld Based",
    "ECMT": "Econometrics",
    "ECON": "Economics",
    "EDCI": "Educ Curriculum & Dev",
    "EHRD": "Ed Human Res Develop",
    "ENDG": "Engr Design Graphics",
    "ENDS": "Environmental Design",
    "ENGL": "English",
    "ENGR": "Engineering",
    "ENST": "Environmental Studies",
    "ENTC": "Engineering Technology",
    "ENTO": "Entomology",
    "EPFB": "Educ Psyc Field Based",
    "EPSY": "Educational Psychology",
    "ESET": "Electronic Sys Eng Tech",
    "ESSM": "Ecosystem Science & Mgmt",
    "EURO": "European Studies",
    "EVEN": "Environmental Engr",
    "FILM": "Film Studies",
    "FINC": "Finance",
    "FINP": "Financial Planning",
    "FIVS": "Forensic & Inv Science",
    "FREN": "French",
    "FRSC": "Forest Science",
    "FSCI": "Foundational Sciences",
    "FSTC": "Food Science & Tech",
    "FYEX": "First Year Experience",
    "GALV": "TAMUG Study Abroad",
    "GENE": "Genetics",
    "GEOG": "Geography",
    "GEOL": "Geology",
    "GEOP": "Geophysics",
    "GEOS": "Geosciences",
    "GERM": "German",
    "HBRW": "Hebrew",
    "HEFB": "Health Ed Field Based",
    "HHUM": "Health Humanities",
    "HISP": "Hispanic Studies",
    "HIST": "History",
    "HLTH": "Health",
    "HMGT": "Hosp, Hotel Mgmt, Tour",
    "HORT": "Horticultural Sciences",
    "HUMA": "Humanities",
    "IBUS": "International Business",
    "IDIS": "Industrial Distribution",
    "INST": "Interdisciplinary Studies",
    "INTA": "International Affairs",
    "INTS": "International Studies",
    "ISEN": "Indust & Systems Engr",
    "ISTM": "Mgmt Info Systems",
    "ITAL": "Italian",
    "ITDE": "Interdisciplinary Engr",
    "ITSV": "Info Tech Service Mgmt",
    "JAPN": "Japanese",
    "JOUR": "Journalism",
    "JWST": "Jewish Studies",
    "KINE": "Kinesiology",
    "KNFB": "Kinesiology Field Based",
    "LAND": "Landscape Architecture",
    "LDEV": "Land Development",
    "LING": "Linguistics",
    "LMAS": "Latino/Mex Amer Studies",
    "MARA": "Maritime Administration",
    "MARB": "Marine Biology",
    "MARE": "Marine Engr Technology",
    "MARR": "Marine Engr Technology",
    "MARS": "Marine Science",
    "MART": "Marine Transportation",
    "MASC": "Integrated Math & Sci",
    "MASE": "Maritime Systems Engr",
    "MAST": "Maritime Studies",
    "MATH": "Mathematics",
    "MEEN": "Mechanical Engineering",
    "MEFB": "Mid Grds Ed Field Based",
    "MEPS": "Molecular & Env Plant Sci",
    "METR": "Meteorology",
    "MGMT": "Management",
    "MICR": "Microbiology",
    "MKTG": "Marketing",
    "MLSC": "Military Science",
    "MMET": "Mfg & Mech Engr Tech",
    "MODL": "Modern Languages",
    "MSEN": "Materials Science & Engr",
    "MTDE": "Multidisciplinary Engr",
    "MUSC": "Music",
    "MUST": "Museum Studies",
    "MXET": "Multidiscip Engr Tech",
    "NAUT": "Nautical Science",
    "NRSC": "Neuroscience",
    "NUEN": "Nuclear Engineering",
    "NURS": "Nursing",
    "NUTR": "Nutrition",
    "NVSC": "Naval Science",
    "OCEN": "Ocean Engineering",
    "OCNG": "Oceanography",
    "PBSI": "Psyc & Brain Sciences",
    "PERF": "Performance Studies",
    "PETE": "Petroleum Engineering",
    "PHIL": "Philosophy",
    "PHLT": "Public Health",
    "PHYS": "Physics",
    "PLPA": "Plant Pathology",
    "POLS": "Political Science",
    "PORT": "Portuguese",
    "POSC": "Poultry Science",
    "PVFA": "Perf Vis Fine Arts",
    "RDNG": "Reading",
    "RELS": "Religious Studies",
    "RENR": "Renewable Natural Resrces",
    "RPTS": "Rec, Park & Tourism Sci",
    "RUSS": "Russian",
    "RWFM": "Rang Wild & Fish Mgmt",
    "SCMT": "Supply Chain Mgmt",
    "SCSC": "Soil and Crop Sciences",
    "SEFB": "Special Ed Field Based",
    "SENG": "Safety Engineering",
    "SOCI": "Sociology",
    "SOMS": "Schl of Military Sciences",
    "SPAN": "Spanish",
    "SPED": "Special Education",
    "SPMT": "Sport Management",
    "STAT": "Statistics",
    "TCMG": "Technology Management",
    "TEED": "Teacher Education",
    "TEFB": "Teacher Ed Field Based",
    "UGST": "Undergraduate Studies",
    "URPN": "Urban & Reg Planning",
    "VIBS": "Vet Integrative Biosci",
    "VIST": "Visual Studies",
    "VLCS": "Vet Large Animal Clin Sc",
    "VSCS": "Vet Small Animal Clin Sc",
    "VTPB": "Veterinary Pathobiology",
    "VTPP": "Vet Physiology & Pharm",
    "WFSC": "Wildlife & Fisheries Sci",
    "WGST": "Women's & Gender Studies",
    "ZOOL": "Zoology"
    }

    profDept = depts[dept]
    tamu_professors = []

    # Check if only one div contains 'Professor' or 'Lecturer', regardless of department
    role_only_profs = [div for div in faculty_divs if 'Professor' in div.text or 'Lecturer' in div.text]
    matching_profs = [div for div in faculty_divs if ('Professor' in div.text or 'Lecturer' in div.text) and profDept in div.text]

    etc_profs = [div for div in faculty_divs if ('Lead' in div.text)]
    
    if (len(faculty_divs) == 0):
        if (soup.find('div', class_='result-listing student fac_staff')):
            faculty_divs.append(soup.find('div', class_='result-listing student fac_staff'))

    if len(role_only_profs) == 1:
        professor_name = role_only_profs[0].find('h2').text.strip()
        tamu_professors.append(rearrange_name(professor_name))
    elif matching_profs:
        # Check if only one div matches both role and department
        if len(matching_profs) == 1:
            professor_name = matching_profs[0].find('h2').text.strip()
            tamu_professors.append(rearrange_name(professor_name))
        else:
            # Check each professor's affiliation with Texas A&M University
            for div in matching_profs:
                profile_link = div.find('a', href=True)['href']
                full_profile_url = f"{base_url}{profile_link}"
                profile_response = requests.get(full_profile_url)
                profile_soup = BeautifulSoup(profile_response.text, 'html.parser')

                institution_info = profile_soup.find('div', class_='additional-info')
                if institution_info:
                    list_items = institution_info.find_all('li')
                    for li in list_items:
                        h3_text = li.find('h3', class_='identification-title').text.strip()
                        following_text = li.find('h3', class_='identification-title').next_sibling.strip()

                        if h3_text == "Institution" and following_text == "Texas A&M University":
                            professor_name = div.find('h2').text.strip()
                            tamu_professors.append(rearrange_name(professor_name))
                            break
    elif len(etc_profs) == 1:
        professor_name = etc_profs[0].find('h2').text.strip()
        tamu_professors.append(rearrange_name(professor_name))
    elif ((len(faculty_divs) == 1) and ("Junior" not in faculty_divs[0].text) and ("Freshmen" not in faculty_divs[0].text) and ("Senior" not in faculty_divs[0].text) and ("Sophmore" not in faculty_divs[0].text)):
        professor_name = faculty_divs[0].find('h2').text.strip()
        tamu_professors.append(rearrange_name(professor_name))
    else:
        for div in role_only_profs:
            profile_link = div.find('a', href=True)['href']
            full_profile_url = f"{base_url}{profile_link}"
            profile_response = requests.get(full_profile_url)
            profile_soup = BeautifulSoup(profile_response.text, 'html.parser')

            institution_info = profile_soup.find('div', class_='additional-info')
            if institution_info:
                list_items = institution_info.find_all('li')
                for li in list_items:
                    h3_text = li.find('h3', class_='identification-title').text.strip()
                    following_text = li.find('h3', class_='identification-title').next_sibling.strip()

                    if h3_text == "Institution" and following_text == "Texas A&M University":
                        professor_name = div.find('h2').text.strip()
                        tamu_professors.append(rearrange_name(professor_name))
                        break

    return tamu_professors

def rearrange_name(name):
    last, first_middle = name.split(', ')
    first = first_middle.split(' ')[0]  # Takes the first part as the first name
    return f"{first} {last}"

# Example usage
last_name = "MORRIS"
first_name = "E"
tamu_professors = get_professor_profiles(last_name, first_name, "AERO")