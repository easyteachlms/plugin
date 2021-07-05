# EasyTeach LMS

- Requires PHP 7.4 and above.
- Requires WordPress 5.8 and above, or WordPress 5.4 with Gutenberg 10.3.

## TODOs

### By July 4th EOD:
- [x] Complete frontend lite interface
  - [x] Course Outline, auto activate uuid when query var present
  - [x] Dashboard
  - [x] Files View
  - [x] Quiz
  - [x] Figure out the rest of the narrowly parse course and all that course data api shit
- [x] Complete Student API revamp based on actions system and lite rest api to edit multiple actions or just one. 
  - [] Starter actions for us:
    - [] Quiz attempts (uuid, attempts with most recent on bottom (a multidimensional array with datetime and grade ))
    - [] Quiz completions (uuid, multidimensional array when a quiz is submitted with higher than or equal to passing score with datetime and the score)
    - [x] Lesson content completions (uuid, date and time of completion)
- [] easy digital downloads Update API and place in plugin settings...
- [] New course select field from select2 that we can use everywhere we need to (product multi course selection and  buddypress multicourse selection)

- [] Certificate
  - [] Certificate Print Preview in browser
- [] BuddyPress??This will be in by end of the week...
