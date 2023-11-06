const availableFoods = [
    { name: "Eggs", calories: 68, carbs: 2, proteins: 6, fats: 5 },
    { name: "Oats", calories: 117, carbs: 51, proteins: 13, fats: 5 },
    { name: "Banana", calories: 110, carbs: 28, proteins: 1, fats: 0 },
    { name: "Manzana", calories: 52, carbs: 9, proteins: 0, fats: 0 },
    // agregar a placer
];

const mealLists = {
    breakfast: document.getElementById("breakfastList"),
    lunch: document.getElementById("lunchList"),
    dinner: document.getElementById("dinnerList"),
    snacks: document.getElementById("snacksList"),
};

const mealCalories = {
    breakfast: document.getElementById("breakfastCalories"),
    lunch: document.getElementById("lunchCalories"),
    dinner: document.getElementById("dinnerCalories"),
    snacks: document.getElementById("snacksCalories"),
};

const mealCarbs = {
    breakfast: document.getElementById("breakfastCarbs"),
    lunch: document.getElementById("lunchCarbs"),
    dinner: document.getElementById("dinnerCarbs"),
    snacks: document.getElementById("snacksCarbs"),
};

const mealProteins = {
    breakfast: document.getElementById("breakfastProteins"),
    lunch: document.getElementById("lunchProteins"),
    dinner: document.getElementById("dinnerProteins"),
    snacks: document.getElementById("snacksProteins"),
};

const mealFats = {
    breakfast: document.getElementById("breakfastFats"),
    lunch: document.getElementById("lunchFats"),
    dinner: document.getElementById("dinnerFats"),
    snacks: document.getElementById("snacksFats"),
};

const myFoodsLists = {
    breakfast: document.getElementById("myFoodsListBreakfast"),
    lunch: document.getElementById("myFoodsListLunch"),
    dinner: document.getElementById("myFoodsListDinner"),
    snacks: document.getElementById("myFoodsListSnacks"),
};

const meals = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
};

let myFoods = [];

// local storage
const storedMyFoods = JSON.parse(localStorage.getItem("myFoods"));
if (storedMyFoods) {
    myFoods = storedMyFoods;
    displayMyFoods();
}

function constructora(foodName, calories, carbs, proteins, fats) {
    this.name = foodName;
    this.calories = calories;
    this.carbs = carbs;
    this.proteins = proteins;
    this.fats = fats;
}
function addSelectedFoodToMeal(meal) {
    const foodSelect = document.getElementById("foodSelect");
    const selectedFoodName = foodSelect.value;
    const foodQuantity = parseFloat(document.getElementById("foodQuantity").value);

    if (selectedFoodName && !isNaN(foodQuantity) && foodQuantity > 0) {
        const selectedFood = availableFoods.find((food) => food.name === selectedFoodName);

        if (selectedFood) {
            // adaptando para que el user pueda ingresar gramos
            const calories = (selectedFood.calories / 100) * foodQuantity;
            const carbs = (selectedFood.carbs / 100) * foodQuantity;
            const proteins = (selectedFood.proteins / 100) * foodQuantity;
            const fats = (selectedFood.fats / 100) * foodQuantity;

            const food = {
                name: selectedFoodName,
                calories: calories,
                carbs: carbs,
                proteins: proteins,
                fats: fats,
            };

            meals[meal].push(food);
            displayMealFoods(meal);
            updateMealTotals(meal);
            document.getElementById("foodSelect").value = "";
            document.getElementById("foodQuantity").value = "";
        }
    } else {
        // SweetAlert
        Swal.fire({
            icon: "error",
            title: "Incomplete",
            text: "Please enter a valid food and serving(g).",
        });
    }
}

function addCustomFoodToMyFoods() {
    const foodName = document.getElementById("foodName").value;
    const calories = parseInt(document.getElementById("calories").value);
    const carbs = parseInt(document.getElementById("carbs").value);
    const proteins = parseInt(document.getElementById("proteins").value);
    const fats = parseInt(document.getElementById("fats").value);

    if (foodName && !isNaN(calories) && !isNaN(carbs) && !isNaN(proteins) && !isNaN(fats)) {
        // find para checkear por nuevo food
        const existingFood = myFoods.find((food) => food.name === foodName);
        if (!existingFood) {
            const food = new constructora(foodName, calories, carbs, proteins, fats);
            myFoods.push(food);
            displayMyFoods();
            saveMyFoodsToLocalStorage();
        }
        clearCustomFoodForm();
    } else {
        alert("Please fill in all fields.");
    }
}

function addMyFoodsToMeal(meal) {
    const selectedFoodName = myFoodsLists[meal].value;
    if (selectedFoodName) {
        const selectedFood = myFoods.find((food) => food.name === selectedFoodName);
        if (selectedFood) {
            meals[meal].push(selectedFood);
            displayMealFoods(meal);
            updateMealTotals(meal);
        }
    }
}

function displayMealFoods(meal) {
    const mealList = mealLists[meal];
    mealList.innerHTML = "";
    for (let i = 0; i < meals[meal].length; i++) {
        const listItem = document.createElement("li");
        listItem.textContent = `${meals[meal][i].name}`;
        mealList.appendChild(listItem);
    }
}

function displayMyFoods() {
    for (const meal in myFoodsLists) {
        myFoodsLists[meal].innerHTML = "";
    }

    for (let i = 0; i < myFoods.length; i++) {
        for (const meal in myFoodsLists) {
            const option = document.createElement("option");
            option.text = myFoods[i].name;
            myFoodsLists[meal].add(option);
        }
    }
}

function updateMealTotals(meal) {
    let totalCal = 0;
    let totalC = 0;
    let totalP = 0;
    let totalF = 0;

    for (const food of meals[meal]) {
        totalCal += food.calories;
        totalC += food.carbs;
        totalP += food.proteins;
        totalF += food.fats;
    }

    mealCalories[meal].textContent = totalCal;
    mealCarbs[meal].textContent = totalC;
    mealProteins[meal].textContent = totalP;
    mealFats[meal].textContent = totalF;

    updateDayCalories();
}

function clearCustomFoodForm() {
    document.getElementById("foodName").value = "";
    document.getElementById("calories").value = "";
    document.getElementById("carbs").value = "";
    document.getElementById("proteins").value = "";
    document.getElementById("fats").value = "";
}

function saveMyFoodsToLocalStorage() {
    localStorage.setItem("myFoods", JSON.stringify(myFoods));
}

function updateDayCalories() {
    let totalCal = 0;
    let totalC = 0;
    let totalP = 0;
    let totalF = 0;

    for (const meal in meals) {
        for (const food of meals[meal]) {
            totalCal += food.calories;
            totalC += food.carbs;
            totalP += food.proteins;
            totalF += food.fats;
        }
    }

    document.getElementById("breakfastCalories").textContent = mealCalories.breakfast.textContent;
    document.getElementById("lunchCalories").textContent = mealCalories.lunch.textContent;
    document.getElementById("dinnerCalories").textContent = mealCalories.dinner.textContent;
    document.getElementById("snacksCalories").textContent = mealCalories.snacks.textContent;

    // update try 34 de los totals, ella sigue sin quererme
    document.getElementById("totalCalories").textContent = totalCal;
    document.getElementById("totalCarbs").textContent = totalC;
    document.getElementById("totalProteins").textContent = totalP;
    document.getElementById("totalFats").textContent = totalF;
}

updateDayCalories();
