#  Shell Scripting Cheat Sheet

> Simple Shell/Bash reference for Linux and DevOps beginners.

---

#  1. Shell Script Basics

## What is Shell Scripting?

Shell scripting means writing Linux commands inside a file and running them together.

Example:

```bash
#!/bin/bash

echo "Hello Sachin"
echo "Welcome to DevOps"
```

---

## Shebang `#!/bin/bash`

**What does it do?**

It tells Linux: **"Run this script using Bash."**

```bash
#!/bin/bash
echo "Hello World"
```

Always keep it at the **first line**.

---

## How to Run a Script

Create:

```bash
nano script.sh
```

Give permission:

```bash
chmod +x script.sh
```

Run:

```bash
./script.sh
```

You can also run:

```bash
bash script.sh
```

### Remember

```text
chmod +x → Give execute permission
./script.sh → Run the script
bash script.sh → Run using Bash
```

---

#  2. Comments

Comments are notes for humans. Linux does not execute them.

```bash
# This is a comment

echo "Hello"  # This is an inline comment
```

---

# 3. Variables

A variable stores information.

```bash
NAME="Sachin"
AGE=22
```

Use the variable:

```bash
echo "$NAME"
echo "$AGE"
```

Output:

```text
Sachin
22
```

### Important

Do NOT put spaces around `=`.

Correct:

```bash
NAME="Sachin"
```

Wrong:

```bash
NAME = "Sachin"
```

---

## Double vs Single Quotes

```bash
NAME="Sachin"

echo "$NAME"
```

Output:

```text
Sachin
```

Double quotes allow the variable to work.

```bash
echo '$NAME'
```

Output:

```text
$NAME
```

Single quotes treat everything as normal text.

### Easy rule

> Use `"$VARIABLE"` most of the time.

---

# 4. Taking User Input

Use `read` to take input from the user.

```bash
#!/bin/bash

read -p "Enter your name: " NAME

echo "Hello $NAME"
```

If user enters:

```text
Sachin
```

Output:

```text
Hello Sachin
```

---

#  5. Command-Line Arguments

Arguments are values given when starting a script.

Example:

```bash
./script.sh Sachin DevOps
```

Inside the script:

```bash
echo "$0"
echo "$1"
echo "$2"
echo "$#"
echo "$@"
```

### Meaning

| Variable | Meaning                      |
| -------- | ---------------------------- |
| `$0`     | Script name                  |
| `$1`     | First argument               |
| `$2`     | Second argument              |
| `$#`     | Number of arguments          |
| `$@`     | All arguments                |
| `$?`     | Previous command's exit code |

Example:

```bash
./script.sh hello world
```

```text
$0 → script.sh
$1 → hello
$2 → world
$# → 2
```

---

#  6. Conditions

Conditions allow a script to make decisions.

Think:

> **If something is true, do this. Otherwise, do that.**

---

## if / else

```bash
AGE=20

if [ "$AGE" -ge 18 ]; then
    echo "You are an adult"
else
    echo "You are under 18"
fi
```

Output:

```text
You are an adult
```

---

## if / elif / else

Use `elif` when there are multiple conditions.

```bash
MARKS=75

if [ "$MARKS" -ge 90 ]; then
    echo "Grade A"
elif [ "$MARKS" -ge 60 ]; then
    echo "Grade B"
else
    echo "Grade C"
fi
```

---

#  7. String Comparisons

Used to compare text.

```bash
A="DevOps"
B="DevOps"
```

Equal:

```bash
[ "$A" = "$B" ]
```

Not equal:

```bash
[ "$A" != "$B" ]
```

Empty:

```bash
[ -z "$A" ]
```

Not empty:

```bash
[ -n "$A" ]
```

---

# 8. Number Comparisons

Use these for numbers.

```bash
A=10
B=20
```

| Operator | Meaning       |
| -------- | ------------- |
| `-eq`    | Equal         |
| `-ne`    | Not equal     |
| `-lt`    | Less than     |
| `-gt`    | Greater than  |
| `-le`    | Less/equal    |
| `-ge`    | Greater/equal |

Example:

```bash
if [ "$A" -lt "$B" ]; then
    echo "A is smaller"
fi
```

---

#  9. File Checking

Bash can check whether a file or directory exists.

```bash
FILE="test.txt"
```

### Common checks

```bash
[ -f "$FILE" ]   # Is it a file?
[ -d "$FILE" ]   # Is it a directory?
[ -e "$FILE" ]   # Does it exist?
[ -r "$FILE" ]   # Can I read it?
[ -w "$FILE" ]   # Can I write it?
[ -x "$FILE" ]   # Can I execute it?
[ -s "$FILE" ]   # Is it non-empty?
```

### Real Example

```bash
if [ -f "backup.tar.gz" ]; then
    echo "Backup exists"
else
    echo "Backup not found"
fi
```

---

# 10. Logical Operators

## AND `&&`

Both conditions must be true.

```bash
[ -f "app.log" ] && [ -r "app.log" ]
```

Meaning:

> File exists AND file is readable.

---

## OR `||`

At least one condition must be true.

```bash
[ "$USER" = "root" ] || [ "$USER" = "admin" ]
```

Meaning:

> User is root OR admin.

---

## NOT `!`

Means the opposite.

```bash
if [ ! -f "backup.tar.gz" ]; then
    echo "Backup does not exist"
fi
```

---

#  11. case Statement

`case` is useful when you have multiple choices.

```bash
CHOICE="start"

case "$CHOICE" in
    start)
        echo "Starting service"
        ;;
    stop)
        echo "Stopping service"
        ;;
    restart)
        echo "Restarting service"
        ;;
    *)
        echo "Invalid option"
        ;;
esac
```

Think:

> **case = multiple if/else choices**

---

#  12. for Loop

A loop repeats something.

## Simple for Loop

```bash
for name in Sachin Rahul Amit; do
    echo "Hello $name"
done
```

Output:

```text
Hello Sachin
Hello Rahul
Hello Amit
```

---

## Number Loop

```bash
for i in 1 2 3 4 5; do
    echo "$i"
done
```

---

## C-Style Loop

```bash
for ((i=1; i<=5; i++)); do
    echo "$i"
done
```

---

#  13. while Loop

`while` runs **while a condition is true**.

```bash
COUNT=1

while [ "$COUNT" -le 5 ]; do
    echo "$COUNT"
    ((COUNT++))
done
```

Output:

```text
1
2
3
4
5
```

### Remember

```text
while → Continue while condition is TRUE
```

---

# 14. until Loop

`until` is almost the opposite of `while`.

```bash
COUNT=1

until [ "$COUNT" -gt 5 ]; do
    echo "$COUNT"
    ((COUNT++))
done
```

### Remember

```text
while → Run while TRUE
until  → Run until TRUE
```

---

# 15. break and continue

## break

Stops the loop completely.

```bash
for i in 1 2 3 4 5; do

    if [ "$i" -eq 3 ]; then
        break
    fi

    echo "$i"
done
```

Output:

```text
1
2
```

---

## continue

Skip the current iteration.

```bash
for i in 1 2 3 4 5; do

    if [ "$i" -eq 3 ]; then
        continue
    fi

    echo "$i"
done
```

Output:

```text
1
2
4
5
```

### Easy memory

```text
break    → Stop
continue → Skip
```

---

# 16. Loop Through Files

Useful in DevOps when processing logs.

```bash
for file in *.log; do
    echo "Processing $file"
done
```

This processes every `.log` file.

---

#  17. Read a File Line by Line

```bash
while read -r line; do
    echo "$line"
done < file.txt
```

This reads `file.txt` one line at a time.

---

#  18. Functions

A function is a reusable block of code.

Instead of writing the same code again and again, create a function.

```bash
greet() {
    echo "Hello DevOps"
}
```

Call it:

```bash
greet
```

Output:

```text
Hello DevOps
```

---

## Function Arguments

```bash
greet() {
    echo "Hello $1"
}

greet "Sachin"
```

Output:

```text
Hello Sachin
```

Inside a function:

```text
$1 → First function argument
$2 → Second function argument
```

---

#  19. return vs echo

### `return`

Used for success/failure.

```bash
check_file() {

    if [ -f "$1" ]; then
        return 0
    else
        return 1
    fi
}
```

Check result:

```bash
check_file "app.log"

echo "$?"
```

---

### `echo`

Used when you want to return actual information.

```bash
add() {
    echo $(( $1 + $2 ))
}

RESULT=$(add 10 20)

echo "$RESULT"
```

Output:

```text
30
```

### Easy memory

```text
return → Success / Failure
echo   → Actual output
```

---

#  20. local Variables

`local` keeps a variable inside a function.

```bash
test() {
    local NAME="Sachin"
    echo "$NAME"
}

test
```

This prevents the function variable from affecting the rest of the script.

---

#  21. grep

`grep` is used to **search text**.

Example:

```bash
grep "error" app.log
```

Find errors in a log.

### Useful options

```bash
grep -i "error" app.log
```

Ignore uppercase/lowercase.

```bash
grep -n "error" app.log
```

Show line numbers.

```bash
grep -c "error" app.log
```

Count matching lines.

```bash
grep -r "error" /var/log/
```

Search directories recursively.

```bash
grep -v "debug" app.log
```

Show everything except `debug`.

### Remember

> `grep` = **Find/Search**

---

#  22. awk

`awk` is very useful for working with **columns**.

Example file:

```text
Sachin DevOps 90
Rahul AWS 85
Amit Linux 95
```

Print first column:

```bash
awk '{print $1}' students.txt
```

Output:

```text
Sachin
Rahul
Amit
```

Print first and third columns:

```bash
awk '{print $1, $3}' students.txt
```

### Remember

> `awk` = **Work with columns/data**

---

#  23. sed

`sed` is mainly used to **replace or edit text**.

Replace:

```bash
sed 's/old/new/g' file.txt
```

Example:

```bash
sed 's/DevOps/Cloud/g' file.txt
```

Edit the actual file:

```bash
sed -i 's/old/new/g' file.txt
```

Delete line 3:

```bash
sed '3d' file.txt
```

### Remember

> `sed` = **Edit/Replace text**

---

#  24. cut

`cut` extracts specific columns.

Example:

```text
Sachin,DevOps,India
```

Get the second column:

```bash
cut -d, -f2 data.csv
```

Output:

```text
DevOps
```

### Remember

> `cut` = **Extract**

---

#  25. sort

Sort lines.

```bash
sort names.txt
```

Numerical sorting:

```bash
sort -n numbers.txt
```

Reverse:

```bash
sort -r names.txt
```

Remove duplicates:

```bash
sort -u names.txt
```

### Remember

> `sort` = **Arrange**

---

#  26. uniq

Remove repeated lines.

```bash
sort names.txt | uniq
```

Count duplicates:

```bash
sort names.txt | uniq -c
```

### Important

`uniq` only detects duplicates when they are next to each other.

That's why we commonly use:

```bash
sort file.txt | uniq
```

---

#  27. tr

`tr` changes or removes characters.

Convert lowercase to uppercase:

```bash
echo "devops" | tr 'a-z' 'A-Z'
```

Output:

```text
DEVOPS
```

Replace spaces:

```bash
echo "hello world" | tr ' ' '_'
```

Output:

```text
hello_world
```

Delete characters:

```bash
echo "hello###" | tr -d '#'
```

### Remember

> `tr` = **Translate characters**

---

#  28. wc

Count lines, words, or characters.

```bash
wc -l file.txt
```

Count lines.

```bash
wc -w file.txt
```

Count words.

```bash
wc -c file.txt
```

Count bytes.

### Remember

> `wc` = **Count**

---

# 29. head and tail

Show the beginning:

```bash
head file.txt
```

Show first 20 lines:

```bash
head -n 20 file.txt
```

Show last 20 lines:

```bash
tail -n 20 file.txt
```

---

## Monitor Logs

This is very useful for DevOps:

```bash
tail -f app.log
```

`-f` means:

> Keep watching the file for new lines.

---

# 30. Useful DevOps One-Liners

## Find Files

Find `.log` files:

```bash
find /var/log -name "*.log"
```

---

## Find Old Files

Find files older than 7 days:

```bash
find /tmp -type f -mtime +7
```

Delete after checking:

```bash
find /tmp -type f -mtime +7 -delete
```

⚠️ Always check the files before using `-delete`.

---

## Find Errors in Logs

```bash
grep -iE "error|fail|critical" app.log
```

---

## Monitor Errors in Real Time

```bash
tail -f app.log | grep --line-buffered -i "error"
```

---

## Check Disk Space

```bash
df -h
```

---

## Check if a Service Is Running

```bash
systemctl is-active nginx
```

Or:

```bash
systemctl status nginx
```

---

## Create a Backup

```bash
tar -czf backup.tar.gz myfolder/
```

Create a timestamped backup:

```bash
tar -czf "backup_$(date +%Y%m%d).tar.gz" myfolder/
```

---

#  31. Error Handling

## Exit Code `$?`

Every command returns a status.

```bash
ls
echo "$?"
```

Usually:

```text
0     → Success
Non-0 → Error
```

Example:

```bash
ls /wrong-folder

echo "$?"
```

---

## exit

Stop the script.

```bash
echo "Something went wrong"
exit 1
```

Common:

```text
exit 0 → Success
exit 1 → Error
```

---

#  32. set -e

Stop the script when a command fails.

```bash
#!/bin/bash

set -e

cp file.txt /backup/

echo "Backup completed"
```

If `cp` fails, the script stops.

---

#  33. set -u

Detect variables that were never defined.

```bash
#!/bin/bash

set -u

echo "$NAME"
```

If `NAME` does not exist, Bash reports an error.

---

#  34. pipefail

Normally, a pipeline may hide an earlier failure.

Use:

```bash
set -o pipefail
```

This makes the pipeline fail if any important command fails.

---

# 35. set -x

Used for debugging.

```bash
#!/bin/bash

set -x

NAME="Sachin"
echo "Hello $NAME"
```

Bash shows commands while executing them.

### Remember

```text
set -e → Stop on error
set -u → Error on unset variable
pipefail → Catch pipeline errors
set -x → Debug/trace commands
```

---

#  36. trap

`trap` is useful for cleanup.

Example:

```bash
cleanup() {
    echo "Cleaning temporary files..."
}

trap cleanup EXIT
```

When the script exits, `cleanup` runs automatically.

Useful for:

* Removing temporary files
* Cleaning resources
* Handling Ctrl+C
* Running cleanup before exit

---

#  37. Most Important Commands to Remember

If you forget everything else, remember these:

| Command     | Easy Meaning      |
| ----------- | ----------------- |
| `echo`      | Print             |
| `read`      | Take input        |
| `grep`      | Search            |
| `awk`       | Work with columns |
| `sed`       | Edit/replace      |
| `cut`       | Extract           |
| `sort`      | Sort              |
| `uniq`      | Remove duplicates |
| `tr`        | Change characters |
| `wc`        | Count             |
| `head`      | Beginning         |
| `tail`      | End/live logs     |
| `find`      | Find files        |
| `tar`       | Archive/backup    |
| `systemctl` | Manage services   |

---

# 🎯 38. Interview Quick Revision

### What is Shell Scripting?

> Shell scripting is writing Linux commands in a script file to automate tasks.

### What is a shebang?

> It tells the operating system which interpreter should execute the script.

### What is `$?`?

> It stores the exit status of the previous command.

### What is `$#`?

> It tells how many arguments were passed to the script.

### What is `$@`?

> It represents all command-line arguments.

### Difference between `grep`, `awk`, and `sed`?

```text
grep → Search
awk  → Process columns/data
sed  → Edit/replace text
```

### Difference between `break` and `continue`?

```text
break    → Stop the loop
continue → Skip current iteration
```

### Difference between `while` and `until`?

```text
while → Run while condition is TRUE
until → Run until condition becomes TRUE
```

### Why use `set -euo pipefail`?

```text
-e → Stop when a command fails
-u → Detect unset variables
pipefail → Detect pipeline failures
```

---

# 🚀 39. Safe Script Template

A simple starting point for DevOps scripts:

```bash
#!/bin/bash

set -euo pipefail

echo "Script started"

# Your commands here

echo "Script completed"
```

---

# 📝 40. My Shell Scripting Learning

During my Shell Scripting practice, I learned how to:

* Create and execute Bash scripts
* Work with variables and user input
* Use command-line arguments
* Make decisions with conditions
* Automate tasks using loops
* Create reusable functions
* Process text using `grep`, `awk`, and `sed`
* Work with files and directories
* Create backups and manage logs
* Check services and disk usage
* Handle errors and debug scripts
* Use Shell scripting for DevOps automation

---

## 💡 Easy Command Memory

```text
SEARCH      → grep
COLUMNS     → awk
EDIT TEXT   → sed
EXTRACT     → cut
SORT        → sort
DUPLICATES  → uniq
CHARACTERS  → tr
COUNT       → wc
FILES       → find
LOGS        → tail -f
BACKUP      → tar
SERVICES    → systemctl
```

> **Goal:** Use Shell scripting to automate repetitive Linux and DevOps tasks instead of doing them manually.

---

**Day 21 — #90DaysOfDevOps 🚀**
