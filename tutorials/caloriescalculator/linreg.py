from pandas import read_csv
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

food_data = read_csv("ABBREV.csv", usecols=[4, 5, 6, 8])

food_data = food_data.dropna()

calories = food_data.iloc[:, 0]

protein_fat_carbs = food_data.iloc[:, 1:]


x_train, x_test, y_train, y_test = train_test_split(protein_fat_carbs.values, calories.values, test_size=0.01)

# create model

linda = LinearRegression(fit_intercept=False)

linda.fit(x_train, y_train)


predictions = linda.predict(x_test)


protein = float(input("Protein(g):"))
fat = float(input("Fat(g):"))
carbs = float(input("Carbs(g):"))

prediction = linda.predict([ [protein, fat, carbs] ])

print("Calories:", prediction)

# coefficients

print("m1, m2, m3: ", linda.coef_)
print("b = ", linda.intercept_)


