import requests
from bs4 import BeautifulSoup

def get_professor_profiles(last_name, first_name, dept):
    base_url = "https://directory.tamu.edu"
    search_url = f"{base_url}/?branch=people&cn={last_name}+{first_name}"
    response = requests.get(search_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    faculty_divs = soup.find_all('div', class_='result-listing fac_staff')
    depts = {"MATH": "Mathematics", "CSCE": "Computer Science and Engineering", "STAT": "Statistics"}
    profDept = depts[dept]
    tamu_professors = []

    # Check if only one div contains 'Professor' or 'Lecturer', regardless of department
    role_only_profs = [div for div in faculty_divs if 'Professor' in div.text or 'Lecturer' in div.text]
    matching_profs = [div for div in faculty_divs if ('Professor' in div.text or 'Lecturer' in div.text) and profDept in div.text]
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
# last_name = "WOOD"
# first_name = "A"
# tamu_professors = get_professor_profiles(last_name, first_name, "STAT")
# print(tamu_professors)
