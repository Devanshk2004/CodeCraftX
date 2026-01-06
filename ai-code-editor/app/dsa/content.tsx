import { ReactNode } from 'react';

export interface CodeExample {
  name: string;
  code: string;
  output: string;
}

export interface PracticeProblem {
  title: string;
  description: string;
  hint: string;
}

export interface TopicContent {
  title: string;
  intro: ReactNode;
  codes: CodeExample[];
  visualizerGif?: string;
  practiceProblems?: PracticeProblem[]; // <--- NEW FIELD
}

export const contentMap: Record<string, Record<string, TopicContent>> = {
  basics: {
    "1": { 
      title: "Loops",
      intro: (
        <>
          <p className="mb-4">
            🔄 <strong>Loops</strong> are control structures that define a block of code to be repeated until a specific condition is met.
          </p>
          <p>
            There are two main types of loops you will use constantly:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-400">
            <li><strong>For Loop:</strong> Used when you know exactly how many times you want to iterate.</li>
            <li><strong>While Loop:</strong> Used when you want to loop until a condition changes.</li>
          </ul>
        </>
      ),
      visualizerGif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2Q1Z3E0Z3E0Z3E0Z3E0Z3E0Z3E0Z3E0Z3E0Z3E0Z3E0Z3E/LMt9638dO8dld9bwgX/giphy.gif",
      codes: [
        {
          name: "For Loop",
          code: `for (int i = 0; i < 5; i++) {
    cout << "Count: " << i << endl;
}`,
          output: `Count: 0
Count: 1
Count: 2
Count: 3
Count: 4`
        },
        {
          name: "Nested Loop",
          code: `for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 2; j++) {
        cout << i << " " << j << endl; 
    }
}`,
          output: `1 1
1 2
2 1
2 2
3 1
3 2`
        },
        {
          name: "While Loop",
          code: `int i = 0;
while (i < 3) {
    cout << "Value: " << i << endl;
    i++;
}`,
          output: `Value: 0
Value: 1
Value: 2`
        }
      ],
      practiceProblems: [
        {
          title: "1. Basic Counter (For Loop)",
          description: "Write a program that prints numbers from 1 to 10, each on a new line.",
          hint: "Use a for loop starting with i=1 and running while i <= 10. Increment i by 1 in each step."
        },
        {
          title: "2. Even Stevens (While Loop)",
          description: "Write a program that prints all even numbers less than 20.",
          hint: "Start a while loop from 0. Inside the loop, check if the number is even (num % 2 == 0) or simply increment by 2 each time."
        },
        {
          title: "3. Square Pattern (Nested Loop)",
          description: "Print a 3x3 grid of asterisks (*).",
          hint: "Use an outer loop to handle the rows (runs 3 times) and an inner loop to handle the columns (prints '*' 3 times)."
        }
      ]
    },
  },
};