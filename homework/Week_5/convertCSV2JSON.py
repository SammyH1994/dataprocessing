import json
import csv

name = "happy_planet"
file = name + ".csv"
json_file = name + ".json"

# Help from: https://stackoverflow.com/questions/19697846/how-to-convert-csv-file-to-multiline-json

#Read CSV File
def read_CSV(file, json_file):
	csv_rows = []
	with open(file) as csvfile:
		reader = csv.DictReader(csvfile)
		field = reader.fieldnames

		for row in reader:
			csv_rows.extend([{field[i]:row[field[i]] for i in range(len(field))}])
		convert_write_json(csv_rows, json_file)

#Convert csv data into json
def convert_write_json(data, json_file):
	with open(json_file, "w", encoding='ascii') as f:
		f.write("{")
		f.write("\"{}\":\n".format(name))
		#print(json.dumps(data, sort_keys=False, indent=4, separators=(',', ': ')))
		f.write(json.dumps(data, sort_keys=False, indent=4, separators=(',', ': '))) #for pretty
		f.write("\n}")

read_CSV(file,json_file)
