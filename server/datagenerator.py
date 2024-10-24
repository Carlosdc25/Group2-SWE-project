import json
import random

"""generate 1000 documents in JSON file format that look like this: {
  "username": "testuser",
  "password": "password",
  "dailyReminderTime": [8, 50, "PM"],
  "daysToRemind": ["Wednesday", "Thursday"],
  "completedDailyHabits": true,
  "streak": 9,
  "habits": {
    "habit1": {
      "name": "high priority",
      "uncompleted": ["pay rent"],
      "completed": ["math exam"]
    },
    "habit2": {
      "name": "academics",
      "uncompleted": ["math hw", "presentation"],
      "completed": ["group project"]
    },
    "habit3": {
      "name": "gym",
      "uncompleted": ["afternoon", "night"],
      "completed": ["morning"]
    },
    "habit4": {
      "name": "home",
      "uncompleted": ["mop floors", "laundry"],
      "completed": ["groceries"]
    }
  }
} prompt. 
ChatGPT, 4o mini, OpenAI, 13, May. 2024, https://chatgpt.com/."""

def generate_user_data_chatgptversion(user_id):
    return {
        "username": f"user{user_id}",
        "password": "password",
        "dailyReminderTime": [random.choice([8, 9, 10]), random.choice([0, 15, 30, 45, 50]), random.choice(["AM", "PM"])],
        "daysToRemind": random.sample(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], 2),
        "completedDailyHabits": random.choice([True, False]),
        "streak": random.randint(0, 30),
        "habits": {
            "habit1": {
                "name": "high priority",
                "uncompleted": random.sample(["pay rent", "buy groceries", "call mom"], k=random.randint(0, 3)),
                "completed": random.sample(["math exam", "finish report", "clean room"], k=random.randint(0, 3))
            },
            "habit2": {
                "name": "academics",
                "uncompleted": random.sample(["math hw", "presentation", "study for test"], k=random.randint(0, 3)),
                "completed": random.sample(["group project", "lab report"], k=random.randint(0, 2))
            },
            "habit3": {
                "name": "gym",
                "uncompleted": random.sample(["afternoon", "night"], k=random.randint(0, 2)),
                "completed": random.sample(["morning"], k=random.randint(0, 1))
            },
            "habit4": {
                "name": "home",
                "uncompleted": random.sample(["mop floors", "laundry"], k=random.randint(0, 2)),
                "completed": random.sample(["groceries"], k=random.randint(0, 1))
            }
        }
    }

def generate_user_data_myversion(user_id):

    # “Python: Remove Random Element from List.” GeeksforGeeks, GeeksforGeeks, 13 Apr. 2023, www.geeksforgeeks.org/python-remove-random-element-from-list/. 
    habit_choices = ["High Priority", "Academics", "Gym", "Finance", "Home"]
    users_habits = ["cat", "cat", "cat", "cat"]
    for i in range(4):
        users_habits[i] = random.choice(habit_choices)
        habit_choices.remove(users_habits[i])

    task_choices = ["pay rent", "buy groceries", "call mom", "math exam", "finish report", "clean room", "math hw", "presentation", "study for test", "group project", "lab report", "afternoon", "night", "morning", "weights", "legs", "arms", "mop floors", "laundry", "groceries"]

    return {
        "username": f"user{user_id}",
        "password": "password",
        "dailyReminderTime": [random.choice([1,2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), random.choice([0, 15, 30, 45, 50]), random.choice(["AM", "PM"])],
        "daysToRemind": random.sample(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], random.choice([1, 2, 3, 4, 5, 6, 7])),
        "completedDailyHabits": random.choice([True, False]),
        "streak": random.randint(0, 30),
        "habits": {
            "habit1": {
                "name": users_habits[0],
                "uncompleted": random.sample(task_choices, k=random.randint(0, 3)),
                "completed": random.sample(task_choices, k=random.randint(0, 3))
            },
            "habit2": {
                "name": users_habits[1],
                "uncompleted": random.sample(task_choices, k=random.randint(0, 3)),
                "completed": random.sample(task_choices, k=random.randint(0, 2))
            },
            "habit3": {
                "name": users_habits[2],
                "uncompleted": random.sample(task_choices, k=random.randint(0, 2)),
                "completed": random.sample(task_choices, k=random.randint(0, 4))
            },
            "habit4": {
                "name": users_habits[3],
                "uncompleted": random.sample(task_choices, k=random.randint(0, 2)),
                "completed": random.sample(task_choices, k=random.randint(0, 1))
            }
        }
    }

users = [generate_user_data_myversion(i) for i in range(1, 101)]

with open('users.json', 'w') as json_file:
    json.dump(users, json_file, indent=2)
