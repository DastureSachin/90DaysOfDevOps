
# Day 06 – Linux File I/O Practice

## 🎯 Goal

Practice basic Linux file input/output operations:

* Create a file
* Write data to a file
* Append data to a file
* Read the complete file
* Read specific parts of a file
* Write and display output using `tee`

---

## 1. Create a File – `touch`

```bash
touch notes.txt
```

### What does it do?

`touch` creates an empty file if the file does not already exist.

It can also update the timestamp of an existing file.

Check the file:

```bash
ls -l notes.txt
```

---

## 2. Write to a File – `>`

```bash
echo "Line 1: Linux file management" > notes.txt
```

### What does `>` do?

`>` is used to **write data to a file**.

If the file already contains data, `>` **overwrites the existing content**.

Example:

```bash
echo "Hello" > notes.txt
echo "Linux" > notes.txt
```

After the second command, the file contains:

```text
Linux
```

The previous `Hello` is removed.

---

## 3. Append to a File – `>>`

```bash
echo "Line 2: File input and output" >> notes.txt
echo "Line 3: Useful for DevOps tasks" >> notes.txt
```

### What does `>>` do?

`>>` is used to **append data to the end of a file**.

It does not remove the existing content.

Check the file:

```bash
cat notes.txt
```

Output:

```text
Line 1: Linux file management
Line 2: File input and output
Line 3: Useful for DevOps tasks
```

---

## 4. Read the Full File – `cat`

```bash
cat notes.txt
```

### What does it do?

`cat` displays the **complete contents of a file** in the terminal.

### Interview Answer

> `cat` is commonly used to display the contents of a file.

---

## 5. Read the Beginning – `head`

```bash
head -n 2 notes.txt
```

Output:

```text
Line 1: Linux file management
Line 2: File input and output
```

### What does it do?

`head` displays the **beginning of a file**.

`-n 2` means:

> Display the first 2 lines.

By default, `head` displays the first 10 lines.

---

## 6. Read the End – `tail`

```bash
tail -n 2 notes.txt
```

Output:

```text
Line 2: File input and output
Line 3: Useful for DevOps tasks
```

### What does it do?

`tail` displays the **end of a file**.

`-n 2` means:

> Display the last 2 lines.

By default, `tail` displays the last 10 lines.

---

## 7. Write and Display at the Same Time – `tee`

```bash
echo "Line 4: tee writes and displays output" | tee -a notes.txt
```

Output:

```text
Line 4: tee writes and displays output
```

Check the file:

```bash
cat notes.txt
```

Output:

```text
Line 1: Linux file management
Line 2: File input and output
Line 3: Useful for DevOps tasks
Line 4: tee writes and displays output
```

### What does `tee` do?

`tee` takes input and:

1. Displays it on the terminal
2. Writes it to a file

The `-a` option means **append** instead of overwrite.

---

# 🔥 Important Interview Concepts

| Command / Operator | Purpose                      |
| ------------------ | ---------------------------- |
| `touch`            | Create an empty file         |
| `>`                | Write / overwrite a file     |
| `>>`               | Append to a file             |
| `cat`              | Read the complete file       |
| `head`             | Read the beginning of a file |
| `tail`             | Read the end of a file       |
| `tee`              | Display and write output     |
| `tee -a`           | Display and append output    |

---

## 🧠 Easy Way to Remember

Think of a file like a notebook:

```text
touch → Create a new empty notebook
>     → Erase and write new content
>>    → Continue writing at the end
cat   → Read the whole notebook
head  → Read from the beginning
tail  → Read from the end
tee   → Write it down and show it at the same time
```

---

## 🎯 Why This Matters for DevOps

File operations are used regularly in DevOps for:

* Reading application logs
* Checking configuration files
* Creating and updating scripts
* Troubleshooting services
* Managing deployment files
* Working with automation and shell scripts

For example:

```bash
cat application.log
```

Read a log file.

```bash
tail -f application.log
```

Monitor new log entries continuously.

```bash
echo "Deployment completed" >> deployment.log
```

Append a message to a log file.

---


# 🧪 Final Practice

Run these commands yourself:

```bash
touch notes.txt

echo "Line 1: Linux file management" > notes.txt

echo "Line 2: File input and output" >> notes.txt

echo "Line 3: Useful for DevOps tasks" | tee -a notes.txt

cat notes.txt

head -n 2 notes.txt

tail -n 2 notes.txt
```

Then verify:

```bash
cat notes.txt
```

Expected output:

```text
Line 1: Linux file management
Line 2: File input and output
Line 3: Useful for DevOps tasks
```

---
