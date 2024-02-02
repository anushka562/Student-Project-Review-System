import pandas as pd
import random

# Function to generate random commit messages
def generate_commit_message():
    commit_messages = ['Task completed', 'Implemented feature', 'Code optimization', 'Bug fixed', 'Documentation updated']
    return random.choice(commit_messages)

# Dummy data
data = {
    'project_id': ['MLP1', 'MLP2', 'MLP3'],
    'project_name': ['Introduction to ML', 'Supervised Learning', 'Unsupervised Learning'],
    'task1_': ['Linear Regression', 'Classification with Decision Trees', 'Clustering with K-Means'],
    'task2_': ['Logistic Regression', 'Ensemble Methods', 'Dimensionality Reduction'],
    'task3_': ['Neural Networks', 'Support Vector Machines', 'Association Rules'],
    'task4_description': ['Cross-validation and Evaluation', 'Hyperparameter Tuning', 'Feature Scaling'],
    'task5_description': ['Model Deployment', 'Model Interpretability', 'Project Presentation'],
    'task1_commit_message': [generate_commit_message() for _ in range(3)],
    'task2_commit_message': [generate_commit_message() for _ in range(3)],
    'task3_commit_message': [generate_commit_message() for _ in range(3)],
    'task4_commit_message': [generate_commit_message() for _ in range(3)],
    'task5_commit_message': [generate_commit_message() for _ in range(3)],
}

# Create a DataFrame
df = pd.DataFrame(data)

# Save the DataFrame to an Excel file
file_path = 'machine_learning_course.xlsx'
df.to_excel(file_path, index=False)

print(f'Machine Learning course Excel file generated and saved at: {file_path}')
