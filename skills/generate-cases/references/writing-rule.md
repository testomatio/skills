## Test Suite Writing Rules


Formulas, business rules, edge-case reasoning, and feature
context live in the suite/test description.
Prerequisites which are common to all test cases must be written as bullet points in the suite description.
Formulas, diagrams, relavant to all test cases can be included as codeblocks in the suite description.


## Test Case Writing Rules

Describe the intent of the test case.
Intent is needed only if title is not fully enough to explain the intent.

Test case consist of description and steps
Description must be clear and concise.
Focus on whitebox testing, thus each operation and observable results must be obtained via public apis or UI.
Prefer using UI over public apis when possible.
If you think UI is available, and test can be achived from UI, test must use it
Understand UI pages and components or API endpoints from source code. If source code not availble ask user for it.
Add system checks only if it not clear how to test via public apis or UI.
It is not a unit test, usually no direct server or code access is allowed.

Why in description, what in steps. 

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

Avoid:

Puffery: pivotal, crucial, vital, testament, enduring legacy
Empty "-ing" phrases: ensuring reliability, showcasing features, highlighting capabilities
Promotional adjectives: groundbreaking, seamless, robust, cutting-edge
Overused AI vocabulary: delve, leverage, multifaceted, foster, realm, tapestry
Formatting overuse: excessive bullets, emoji decorations, bold on every other word

Be specific, not grandiose. Say what it actually does. Avoid marketing language.


Words to watch: stands/serves as, is a testament/reminder, plays a vital/significant/crucial/pivotal role, underscores/highlights its importance/significance, reflects broader, symbolizing its ongoing/enduring/lasting impact, key turning point, indelible mark, deeply rooted, profound heritage, steadfast dedication...

Words to watch: ensuring ..., highlighting ..., emphasizing ..., reflecting ..., underscoring ..., showcasing ..., aligns with..., contributing to...

Words to watch: continues to captivate, groundbreaking (in the figurative sense), stunning natural beauty, enduring/lasting legacy, nestled, in the heart of, boasts a...

Words to watch: it's important/critical/crucial to note/remember/consider, may vary...

Words to watch: In summary, In conclusion, Overall...

Words to watch: Despite its... faces several challenges..., Despite these challenges, Challenges and Legacy, Future Outlook...

Words to watch: align/aligns/aligning with,68 crucial,1 delve/delves/delving (pre-2025),681 emphasizing,68 enduring,8 enhance/enhances/enhancing,81 fostering,81 garnered/garnering,68 highlight/highlighted/highlighting/highlights (as a verb),1 interplay,8 intricate/intricacies,687 key (as an adjective), landscape,8 leveraging,1 multifaceted,687 notably,8 nuanced,68 realm,8 robust,1 seamless/seamlessly,1 shed light on, showcasing,8 streamline,1 tapestry,8 testament,18 underpin/underpins/underpinning,8 underscore/underscores/underscoring,8 vibrant,87 vital,1 ...

Parallel constructions involving "not", "but", or "however" such as "Not only ... but ..." or "It is not just about ..., it's ..." are common in LLM writing but are often unsuitable for writing in a neutral tone.

Avoid using emojis if not explicitly intended.
