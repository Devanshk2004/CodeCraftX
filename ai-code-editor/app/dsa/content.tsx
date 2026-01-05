import { ReactNode } from 'react';

// Define the shape of our data for type safety
export interface CodeExample {
  name: string;
  code: string;
  output: string; // New field for output
}

export interface TopicContent {
  title: string;
  intro: ReactNode;
  codes: CodeExample[];
}

// The Main Content Map
export const contentMap: Record<string, Record<string, TopicContent>> = {
  basics: {
    "1": { // basics/1 -> Loops
      title: "Loops",
      intro: (
        <>
          <p className="mb-4">
            🔄 <strong>Loops</strong> are control structures that define a block of code to be repeated until a specific condition is met. They are essential for automating repetitive tasks.
          </p>
          <p>
            There are two main types of loops you will use constantly:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-400">
            <li><strong>For Loop:</strong> Used when you know exactly how many times you want to iterate (e.g., "Run 10 times").</li>
            <li><strong>While Loop:</strong> Used when you want to loop until a condition changes (e.g., "Run while user input is valid").</li>
          </ul>
        </>
      ),
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
      ]
    },
    // Add more subtopics here...
  },
  // Add more topics here...
};

