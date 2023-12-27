dept = input("input 4 letters: ")
num = input("3 digit num: ")
prof_input = input("Which prof are you looking for?: ")
# dept = "CSCE"
# num = 222
# prof_input = "Martin Carlisle"
# Data to be sent in the POST request
data = {
    'dept': dept,
    'number': num
}
