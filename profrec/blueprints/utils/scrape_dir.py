import requests
from bs4 import BeautifulSoup

def get_professor_profiles(last_name, first_name, dept):
    base_url = "https://directory.tamu.edu"
    search_url = f"{base_url}/?branch=people&cn={last_name}+{first_name}"
    response = requests.get(search_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    faculty_divs = soup.find_all('div', class_='result-listing fac_staff')
    depts = {"MATH" : "Mathematics", "CSCE" : "Computer Science and Engineering", "STAT" : "Statistics"}
    profDept = depts[dept]
    tamu_professors = []

    for div in faculty_divs:
        text = ''.join(li.text for li in div.find_all('li'))
        if ('Professor' in text or 'Lecturer' in text) and profDept in text:
            profile_link = div.find('a', href=True)['href']
            full_profile_url = f"{base_url}{profile_link}"
            profile_response = requests.get(full_profile_url)
            profile_soup = BeautifulSoup(profile_response.text, 'html.parser')

            # Check if the institution is Texas A&M University
            institution_info = profile_soup.find('div', class_='additional-info')
            if institution_info:
                list_items = institution_info.find_all('li')
                for li in list_items:
                    # Extract text from the h3 tag and the following sibling (text node)
                    h3_text = li.find('h3', class_='identification-title').text.strip()
                    following_text = li.find('h3', class_='identification-title').next_sibling.strip()

                    # Check if the text exactly matches "Institution" and "Texas A&M University"
                    if h3_text == "Institution" and following_text == "Texas A&M University":
                        professor_name = div.find('h2').text.strip()
                        tamu_professors.append(professor_name)
                        break

            
    tamu_professors = rearrange_name(tamu_professors[0])
    return tamu_professors

def rearrange_name(name):
    last, first_middle = name.split(', ')
    first = first_middle.split(' ')[0]  # Takes the first part as the first name
    return f"{first} {last}"


# Example usage
# last_name = "WILLIS"
# first_name = "M"
# tamu_professors = get_professor_profiles(last_name, first_name)
# print(tamu_professors)