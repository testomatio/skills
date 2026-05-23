## Test Suite Writing Rules


Formulas, business rules, edge-case reasoning, and feature context live in the suite/test description.
Prerequisites which are common to all test cases must be written as bullet points in the suite description.
Formulas, diagrams, relavant to all test cases can be included as codeblocks in the suite description.


## Test Case Writing Rules


Test case consist of description and steps
Add the intent of the test case to the description if title is not fully enough to explain the intent.
Description must be clear and concise.
Focus on blackbox testing, thus each operation and observable results must be obtained via public apis or UI (unless user specifies otherwise).
Prefer using UI (frondend tests) over public apis when possible.
Ask user for app url and credentials, or frontend repo url to understand the application and its components.
Understand UI pages and components or API endpoints from source code or design or requirements. 
Add system checks only if it not clear how to test via public apis or UI.
It is not a unit test, usually no direct server or code access is allowed.

"Why" in description, "what" in steps. 

Put preparations into **preconditions**/**description** section, not as steps.


## Preconditions  

Do not include preconditions like "service is running" if it's not explicitly mentioned by user or is not actually what the test is about.
Define the pre-conditions and initial state of the system as bullet points.
Avoid if not needed or is the same as the suite description.
If relevant, include the user role


## Steps

Step should consist of **action** (with optional test data) and **expected result**.
Each step must be simple sentences.
Avoid using commas, subsentances
Steps are mechanical: click, send, read, assert.
Each step must include exact instructions
Prefer steps that include specific values, urls
Prefer concrete values over general words. Replace "small", "known", "around", "e.g.", "like", "(…)" with literal numbers, strings, etc. 
If no values are availble use placholders variable names like `${url}` or `${company-title}`
Avoid general statements in steps. Move general statements to the description.
Do not chain multiple distinct actions or use unnecessary And / Or combinations in a single sequence.
All step actions must be clear to perform via PUBLIC API or UI
All checks/verifications/assertions should be in **expected result**, not as separate steps.
You may add a codeblock after a step if needed to:

- write API request
- write SQL
- write shell command
- to illustrate the point using pseudocode
- etc

Avoid using bold/italic formatting in steps.

If expected result has multiple conditions split them into separate lines:

Instead of:
  *Expected:* Comment appears in the Run's comment list with the current user as author*

Use:
  *Expected:* Comment appears in the Run's comment list
  *Expected:* Current user is the author


## AI Writing Patterns to Avoid

Be specific, not grandiose. Say what it actually does. Avoid marketing language and emojis (unless explicitly intended).

Avoid:

- Puffery: pivotal, crucial, vital, testament, enduring legacy, indelible mark, deeply rooted, profound heritage, steadfast dedication, key turning point
- Promotional adjectives: groundbreaking (figurative), seamless/seamlessly, robust, cutting-edge, vibrant, nuanced, multifaceted, intricate/intricacies, stunning natural beauty
- Overused AI vocabulary: delve/delves, leverage/leveraging, foster/fostering, realm, tapestry, landscape, interplay, streamline, shed light on, garnered, notably, key (as adjective)
- Empty "-ing" phrases: ensuring, showcasing, highlighting, emphasizing, reflecting, underscoring, aligning with, contributing to, enhancing, underpinning
- Filler frames: stands/serves as, is a testament/reminder, plays a vital/significant/crucial/pivotal role, underscores/highlights its importance, reflects broader, symbolizing its ongoing/enduring/lasting impact, continues to captivate, nestled in the heart of, boasts a
- Hedges and closers: it's important/critical/crucial to note/remember/consider, may vary, In summary, In conclusion, Overall
- "Challenges/Legacy" framing: Despite its... faces several challenges, Despite these challenges, Challenges and Legacy, Future Outlook
- Parallel "not/but/however" constructions: "Not only ... but ...", "It is not just about ..., it's ..." — common in LLM writing but unsuitable for a neutral tone
- Formatting overuse: excessive bullets, emoji decorations, bold on every other word
