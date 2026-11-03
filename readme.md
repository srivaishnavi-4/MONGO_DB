# MongoDB
## 1_Introduction to MongoDB Shell
### Definition

MongoDB Shell (`mongosh`) is an interactive JavaScript-based command-line interface used to communicate with MongoDB databases.

It allows developers to create databases, manage collections, insert documents, retrieve data, update documents, delete records, and perform advanced database operations.

### Why is MongoDB Shell used?

- To interact directly with MongoDB databases.
- To create and manage databases and collections.
- To perform CRUD operations.
- To filter and retrieve specific documents.
- To update and delete existing documents.
- To perform aggregation and data analysis.
- To create indexes and improve query performance.
- To test MongoDB queries before integrating them into Node.js applications.

### Basic MongoDB structure

MongoDB follows a hierarchical structure:

```text
MongoDB Server
    |
    |--- Database
            |
            |--- Collection
                    |
                    |--- Document
                            |
                            |--- Fields
```

| Component | Description |
|---|---|
| Database | Stores multiple collections. |
| Collection | Stores related documents. |
| Document | Stores individual records in BSON format. |
| Field | Stores individual values inside a document. |

Example:

```javascript
{
    name: "Vaishu",
    age: 22,
    department: "CSE"
}
```

Here, `name`, `age`, and `department` are fields of a document.

---

# 2. Database Management Operations

## 2.1 Display Existing Databases

### Definition

The `show dbs` command displays all databases that contain data.

### Syntax

```javascript
show dbs
```

### Example

```javascript
show dbs
```

### Expected output

```text
admin
config
local
collegeDB
```

### Purpose

- View available databases.
- Verify whether a database has been created.
- Identify databases available on the connected MongoDB server.

## 2.2 Create or Switch to a Database

### Definition

The `use` command switches to an existing database or prepares a new database with the specified name.

### Syntax

```javascript
use databaseName
```

### Example

```javascript
use collegeDB
```

### Expected output

```text
switched to db collegeDB
```

### Verify the current database

```javascript
db
```

### Important points

- MongoDB does not physically create a new database immediately after executing `use`.
- The database becomes visible in `show dbs` after data is stored or a collection is created.
- If the database already exists, `use` switches to that database.
- You do not need to reconnect to MongoDB when switching databases.

## 2.3 Delete a Database

### Definition

The `dropDatabase()` command deletes the currently selected database.

### Syntax

```javascript
db.dropDatabase()
```

### Example

```javascript
use collegeDB

db.dropDatabase()
```

### Purpose

- Remove an unwanted database.
- Clean up test databases.
- Reset a database during development.

**Important:** This operation permanently deletes the selected database and its collections. Verify the current database using `db` before executing it.

---

# 3. Collection Management Operations

## 3.1 Create a Collection

### Definition

A collection is a group of MongoDB documents. It is similar to a table in relational databases.

The `createCollection()` method creates a new collection inside the currently selected database.

### Syntax

```javascript
db.createCollection("collectionName")
```

### Example

```javascript
db.createCollection("students")
```

### Expected output

```javascript
{ ok: 1 }
```

## 3.2 Create Multiple Collections

```javascript
db.createCollection("students")

db.createCollection("courses")

db.createCollection("teachers")

db.createCollection("departments")
```

### Database structure

```text
collegeDB
    |
    |--- students
    |--- courses
    |--- teachers
    |--- departments
```

## 3.3 Display All Collections

### Syntax

```javascript
show collections
```

Alternative:

```javascript
db.getCollectionNames()
```

### Expected output

```text
students
courses
teachers
departments
```

## 3.4 Rename a Collection

### Definition

The `renameCollection()` method changes the name of an existing collection.

### Syntax

```javascript
db.oldCollectionName.renameCollection("newCollectionName")
```

### Example

```javascript
db.students.renameCollection("learners")
```

The collection name changes from `students` to `learners`.

## 3.5 Delete a Collection

### Definition

The `drop()` method removes an entire collection from a database.

### Syntax

```javascript
db.collectionName.drop()
```

### Example

```javascript
db.students.drop()
```

### Important points

- Deletes the entire collection.
- Removes all documents in that collection.
- Removes its indexes.
- Does not delete the database itself.

---

# 4. Insert Operations

MongoDB provides two main insertion methods: `insertOne()` and `insertMany()`.

## 4.1 insertOne() – Insert a Single Document

### Definition

The `insertOne()` method inserts one document into a specified collection.

### Syntax

```javascript
db.collectionName.insertOne({
    field1: value1,
    field2: value2
})
```

### Example

```javascript
db.students.insertOne({
    name: "Vaishu",
    age: 22,
    department: "CSE",
    city: "Coimbatore",
    marks: 90,
    skills: ["JavaScript", "Node.js", "MongoDB"]
})
```

### Expected output

```javascript
{
    acknowledged: true,
    insertedId: ObjectId("...")
}
```

### How it works

1. MongoDB receives the document.
2. MongoDB generates an `_id` field if one is not supplied.
3. The document is inserted into the collection.
4. MongoDB returns an acknowledgement and inserted document ID.

## 4.2 insertMany() – Insert Multiple Documents

### Definition

The `insertMany()` method inserts multiple documents into a collection in one operation.

### Syntax

```javascript
db.collectionName.insertMany([
    { field1: value1 },
    { field1: value2 },
    { field1: value3 }
])
```

### Example

```javascript
db.students.insertMany([
    {
        name: "Arun",
        age: 23,
        department: "IT",
        city: "Chennai",
        marks: 85
    },
    {
        name: "Priya",
        age: 21,
        department: "CSE",
        city: "Madurai",
        marks: 95
    },
    {
        name: "Kumar",
        age: 22,
        department: "ECE",
        city: "Coimbatore",
        marks: 75
    },
    {
        name: "Divya",
        age: 24,
        department: "IT",
        city: "Salem",
        marks: 88
    },
    {
        name: "Ravi",
        age: 22,
        department: "CSE",
        city: "Chennai",
        marks: 60
    }
])
```

### Expected output

```javascript
{
    acknowledged: true,
    insertedIds: {
        '0': ObjectId("..."),
        '1': ObjectId("..."),
        '2': ObjectId("..."),
        '3': ObjectId("..."),
        '4': ObjectId("...")
    }
}
```

### How it works

1. MongoDB receives an array of documents.
2. Each document is assigned an `_id` if required.
3. MongoDB inserts the documents into the collection.
4. MongoDB returns the inserted document IDs.

## 4.3 Insert Data into Different Collections

```javascript
db.courses.insertMany([
    {
        courseName: "JavaScript",
        duration: "3 months",
        fees: 5000
    },
    {
        courseName: "MongoDB",
        duration: "2 months",
        fees: 4000
    },
    {
        courseName: "Node.js",
        duration: "3 months",
        fees: 6000
    }
])
```

```javascript
db.teachers.insertMany([
    {
        name: "John",
        subject: "JavaScript",
        experience: 5
    },
    {
        name: "David",
        subject: "MongoDB",
        experience: 8
    }
])
```

```javascript
db.departments.insertMany([
    {
        departmentName: "CSE",
        hod: "John"
    },
    {
        departmentName: "IT",
        hod: "David"
    },
    {
        departmentName: "ECE",
        hod: "Kumar"
    }
])
```

### Important points

- `insertOne()` inserts one document.
- `insertMany()` inserts multiple documents.
- MongoDB automatically generates `_id` values when they are not supplied.
- A collection is automatically created when data is inserted into a collection that does not exist.

---

# 5. Read Operations – Retrieving Documents

Read operations retrieve documents from MongoDB collections.

## 5.1 find() – Retrieve All Documents

### Definition

The `find()` method retrieves all documents or documents matching a specified filter.

### Syntax

```javascript
db.collectionName.find()
```

### Example

```javascript
db.students.find()
```

This retrieves all documents from the students collection.

## 5.2 find().pretty() – Formatted Output

### Definition

The `pretty()` method formats the displayed documents to improve readability.

### Example

```javascript
db.students.find().pretty()
```

## 5.3 findOne() – Retrieve One Document

### Definition

The `findOne()` method retrieves the first document that matches the specified filter.

### Syntax

```javascript
db.collectionName.findOne({
    fieldName: value
})
```

### Example

```javascript
db.students.findOne({
    name: "Vaishu"
})
```

### How it works

1. MongoDB searches the collection.
2. It identifies the first matching document.
3. It returns that document.
4. If no document matches, it returns `null`.

## 5.4 Find Using a Specific Field

```javascript
db.students.find({
    department: "CSE"
})
```

Retrieves all students belonging to the CSE department.

## 5.5 Find Using Multiple Conditions

```javascript
db.students.find({
    department: "CSE",
    city: "Chennai"
})
```

Both conditions must match.

This is equivalent to an AND operation.

---

# 6. Update Operations

Update operations modify existing documents in a collection.

MongoDB provides `updateOne()`, `updateMany()`, and `replaceOne()`.

## 6.1 updateOne() – Update One Document

### Definition

The `updateOne()` method updates the first document that matches the specified filter.

### Syntax

```javascript
db.collectionName.updateOne(
    { filterCondition },
    {
        $set: {
            fieldName: newValue
        }
    }
)
```

### Example

```javascript
db.students.updateOne(
    { name: "Vaishu" },
    {
        $set: {
            age: 23,
            city: "Chennai"
        }
    }
)
```

### Expected output

```javascript
{
    acknowledged: true,
    matchedCount: 1,
    modifiedCount: 1
}
```

### How it works

1. MongoDB searches for a document matching the filter.
2. It identifies the first matching document.
3. The `$set` operator changes the specified fields.
4. Other existing fields remain unchanged.

## 6.2 updateMany() – Update Multiple Documents

### Definition

The `updateMany()` method updates every document matching the specified filter.

### Example

```javascript
db.students.updateMany(
    { department: "CSE" },
    {
        $set: {
            course: "Full Stack Development"
        }
    }
)
```

All matching CSE students receive the new `course` field.

## 6.3 $set – Set or Modify a Field

### Definition

The `$set` operator creates a field if it does not exist or updates its value if it already exists.

```javascript
db.students.updateOne(
    { name: "Vaishu" },
    {
        $set: {
            city: "Chennai"
        }
    }
)
```

## 6.4 $inc – Increment a Numeric Field

### Definition

The `$inc` operator increases or decreases a numeric field by a specified value.

```javascript
db.students.updateOne(
    { name: "Vaishu" },
    {
        $inc: {
            marks: 5
        }
    }
)
```

If the previous marks were 90, the updated marks become 95.

## 6.5 $unset – Remove a Field

### Definition

The `$unset` operator removes a specified field from a document.

```javascript
db.students.updateOne(
    { name: "Vaishu" },
    {
        $unset: {
            city: ""
        }
    }
)
```

The `city` field is removed.

## 6.6 $push – Add an Element to an Array

### Definition

The `$push` operator adds a new element to an existing array.

```javascript
db.students.updateOne(
    { name: "Vaishu" },
    {
        $push: {
            skills: "Express.js"
        }
    }
)
```

## 6.7 $pull – Remove an Element from an Array

### Definition

The `$pull` operator removes matching elements from an array.

```javascript
db.students.updateOne(
    { name: "Vaishu" },
    {
        $pull: {
            skills: "Node.js"
        }
    }
)
```

## 6.8 replaceOne() – Replace an Entire Document

### Definition

The `replaceOne()` method replaces the contents of the first matching document with a new document.

### Example

```javascript
db.students.replaceOne(
    { name: "Arun" },
    {
        name: "Arun",
        age: 24,
        department: "IT",
        city: "Bangalore",
        marks: 90
    }
)
```

### Important points

- `updateOne()` modifies one matching document.
- `updateMany()` modifies all matching documents.
- `replaceOne()` replaces the document's existing fields except its `_id`.
- `$set` modifies selected fields.
- `$inc` changes numeric values.
- `$unset` removes fields.
- `$push` and `$pull` manipulate arrays.

---

# 7. Delete Operations

Delete operations remove documents or entire collections.

## 7.1 deleteOne() – Delete One Document

### Definition

The `deleteOne()` method deletes the first document matching the specified filter.

### Syntax

```javascript
db.collectionName.deleteOne({
    fieldName: value
})
```

### Example

```javascript
db.students.deleteOne({
    name: "Ravi"
})
```

### Expected output

```javascript
{
    acknowledged: true,
    deletedCount: 1
}
```

## 7.2 deleteMany() – Delete Multiple Documents

### Definition

The `deleteMany()` method deletes all documents matching the specified filter.

### Example

```javascript
db.students.deleteMany({
    department: "ECE"
})
```

## 7.3 Delete All Documents

```javascript
db.students.deleteMany({})
```

An empty filter `{}` matches all documents.

This removes every document while keeping the collection.

## 7.4 Drop a Collection

```javascript
db.students.drop()
```

Deletes the entire collection.

## 7.5 Drop a Database

```javascript
db.dropDatabase()
```

Deletes the currently selected database.

**Important:** Always verify your database and filter conditions before performing delete operations.

---

# 8. Filtering Operations – MongoDB Query Operators

Filtering allows developers to retrieve documents based on specific conditions.

MongoDB provides comparison, logical, element, and array query operators.

## 8.1 Comparison Operators

| Operator | Meaning |
|---|---|
| `$eq` | Equal to |
| `$ne` | Not equal to |
| `$gt` | Greater than |
| `$gte` | Greater than or equal to |
| `$lt` | Less than |
| `$lte` | Less than or equal to |
| `$in` | Matches any value in an array |
| `$nin` | Does not match any value in an array |

### $eq – Equal To

```javascript
db.students.find({
    age: { $eq: 22 }
})
```

Retrieves students whose age is exactly 22.

### $ne – Not Equal To

```javascript
db.students.find({
    age: { $ne: 22 }
})
```

Retrieves students whose age is not 22.

### $gt – Greater Than

```javascript
db.students.find({
    marks: { $gt: 80 }
})
```

Retrieves students whose marks are greater than 80.

### $gte – Greater Than or Equal To

```javascript
db.students.find({
    marks: { $gte: 80 }
})
```

### $lt – Less Than

```javascript
db.students.find({
    marks: { $lt: 80 }
})
```

### $lte – Less Than or Equal To

```javascript
db.students.find({
    marks: { $lte: 80 }
})
```

### $in – Match Any Value

```javascript
db.students.find({
    city: {
        $in: ["Chennai", "Madurai"]
    }
})
```

Retrieves students from either Chennai or Madurai.

### $nin – Exclude Specified Values

```javascript
db.students.find({
    city: {
        $nin: ["Chennai", "Madurai"]
    }
})
```

Retrieves documents whose city is not one of the specified values. Documents missing the field can also match `$nin`.

## 8.2 Logical Operators

| Operator | Meaning |
|---|---|
| `$and` | All conditions must be true |
| `$or` | At least one condition must be true |
| `$not` | Negates a condition |
| `$nor` | None of the conditions should be true |

### $and – AND Operation

```javascript
db.students.find({
    $and: [
        { age: 22 },
        { marks: { $gt: 70 } }
    ]
})
```

Both conditions must match.

### $or – OR Operation

```javascript
db.students.find({
    $or: [
        { department: "CSE" },
        { city: "Chennai" }
    ]
})
```

At least one condition must match.

### $not – NOT Operation

```javascript
db.students.find({
    marks: {
        $not: { $gt: 80 }
    }
})
```

Finds documents where the marks condition is not greater than 80. It can also match documents where the field is missing.

### $nor – NOR Operation

```javascript
db.students.find({
    $nor: [
        { department: "CSE" },
        { city: "Chennai" }
    ]
})
```

Retrieves documents that match neither condition.

## 8.3 Element Operators

| Operator | Meaning |
|---|---|
| `$exists` | Checks whether a field exists |
| `$type` | Checks the data type of a field |

### $exists

```javascript
db.students.find({
    city: { $exists: true }
})
```

Finds documents containing the city field.

```javascript
db.students.find({
    city: { $exists: false }
})
```

Finds documents without the city field.

### $type

```javascript
db.students.find({
    age: { $type: "number" }
})
```

Finds documents where age is stored as a number.

## 8.4 Array Operators

| Operator | Meaning |
|---|---|
| `$all` | Matches arrays containing all specified values |
| `$size` | Matches arrays with an exact number of elements |
| `$elemMatch` | Matches documents where at least one array element satisfies specified conditions |

### $all

```javascript
db.students.find({
    skills: {
        $all: ["JavaScript", "MongoDB"]
    }
})
```

Finds students having both JavaScript and MongoDB skills.

### $size

```javascript
db.students.find({
    skills: {
        $size: 3
    }
})
```

Finds students with exactly three array elements.

### $elemMatch

```javascript
db.students.find({
    scores: {
        $elemMatch: {
            $gte: 80,
            $lt: 95
        }
    }
})
```

Finds documents containing at least one score between 80 and 95, excluding 95.

This example assumes a `scores` array exists.

---

# 9. Projection – Retrieve Specific Fields

### Definition

Projection specifies which fields should be included or excluded when retrieving documents.

It helps avoid returning unnecessary data.

### Syntax

```javascript
db.collectionName.find(
    { filterCondition },
    { fieldName: 1 }
)
```

### Example – Retrieve only name and age

```javascript
db.students.find(
    {},
    {
        name: 1,
        age: 1
    }
)
```

### Example – Exclude the _id field

```javascript
db.students.find(
    {},
    {
        name: 1,
        age: 1,
        _id: 0
    }
)
```

### Projection rules

- `1` includes a field.
- `0` excludes a field.
- By default, MongoDB includes `_id`.
- `_id` can be excluded while including other fields.
- Inclusion and exclusion generally cannot be mixed in the same projection, except for `_id`.

---

# 10. Sorting Operations

### Definition

Sorting arranges retrieved documents in ascending or descending order based on one or more fields.

## 10.1 Ascending Order

```javascript
db.students.find().sort({
    marks: 1
})
```

`1` represents ascending order.

## 10.2 Descending Order

```javascript
db.students.find().sort({
    marks: -1
})
```

`-1` represents descending order.

## 10.3 Sort Using Multiple Fields

```javascript
db.students.find().sort({
    department: 1,
    marks: -1
})
```

### How it works

1. Documents are sorted by department alphabetically.
2. Within each department, documents are sorted by marks from highest to lowest.

---

# 11. Limit and Skip Operations

These methods are commonly used for controlling the number of retrieved documents and implementing pagination.

## 11.1 limit()

### Definition

The `limit()` method restricts the number of documents returned by a query.

### Example

```javascript
db.students.find().limit(3)
```

Returns a maximum of three documents.

## 11.2 skip()

### Definition

The `skip()` method skips a specified number of documents before returning results.

### Example

```javascript
db.students.find().skip(2)
```

Skips the first two documents.

## 11.3 Pagination Using skip() and limit()

Pagination divides a large dataset into smaller pages.

### Page 1

```javascript
db.students.find().skip(0).limit(2)
```

### Page 2

```javascript
db.students.find().skip(2).limit(2)
```

### Page 3

```javascript
db.students.find().skip(4).limit(2)
```

### Pagination formula

```javascript
skip = (pageNumber - 1) * pageSize
```

Example:

```javascript
const pageNumber = 2;
const pageSize = 3;

db.students.find()
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
```

For consistent pagination, use sorting before applying `skip()` and `limit()`.

---

# 12. Count and Distinct Operations

## 12.1 countDocuments()

### Definition

Returns the number of documents matching a specified filter.

### Count all documents

```javascript
db.students.countDocuments()
```

### Count documents matching a condition

```javascript
db.students.countDocuments({
    department: "CSE"
})
```

## 12.2 estimatedDocumentCount()

Provides an estimated total number of documents in a collection.

```javascript
db.students.estimatedDocumentCount()
```

## 12.3 distinct()

### Definition

The `distinct()` method retrieves unique values from a specified field.

### Example – Unique departments

```javascript
db.students.distinct("department")
```

### Example – Unique cities

```javascript
db.students.distinct("city")
```

---

# 13. Aggregation Operations

### Definition

Aggregation is a MongoDB feature used to process documents through multiple stages and perform calculations, grouping, filtering, and transformations.

Aggregation uses a pipeline containing multiple stages.

### Basic syntax

```javascript
db.collectionName.aggregate([
    { stage1: {} },
    { stage2: {} },
    { stage3: {} }
])
```

Each stage processes the documents and passes its results to the next stage.

## 13.1 $match – Filter Documents

### Definition

The `$match` stage filters documents based on specified conditions.

```javascript
db.students.aggregate([
    {
        $match: {
            marks: { $gt: 70 }
        }
    }
])
```

## 13.2 $group – Group Documents

### Definition

The `$group` stage groups documents based on a specified field and performs calculations.

```javascript
db.students.aggregate([
    {
        $group: {
            _id: "$department",
            totalStudents: { $sum: 1 }
        }
    }
])
```

Groups students by department and counts the students in each department.

## 13.3 Calculate Average Marks

```javascript
db.students.aggregate([
    {
        $group: {
            _id: "$department",
            averageMarks: { $avg: "$marks" }
        }
    }
])
```

## 13.4 Find Maximum and Minimum Marks

```javascript
db.students.aggregate([
    {
        $group: {
            _id: null,
            maximumMarks: { $max: "$marks" },
            minimumMarks: { $min: "$marks" }
        }
    }
])
```

## 13.5 $sort – Sort Aggregation Results

```javascript
db.students.aggregate([
    {
        $group: {
            _id: "$department",
            totalStudents: { $sum: 1 }
        }
    },
    {
        $sort: {
            totalStudents: -1
        }
    }
])
```

## 13.6 $project – Select Output Fields

```javascript
db.students.aggregate([
    {
        $project: {
            _id: 0,
            studentName: "$name",
            studentAge: "$age",
            studentMarks: "$marks"
        }
    }
])
```

## 13.7 $limit – Restrict Aggregation Results

```javascript
db.students.aggregate([
    {
        $sort: {
            marks: -1
        }
    },
    {
        $limit: 3
    }
])
```

Returns the top three students according to marks.

### Important aggregation stages

| Stage | Purpose |
|---|---|
| `$match` | Filter documents |
| `$group` | Group documents and calculate values |
| `$sort` | Sort documents |
| `$project` | Include, exclude, or transform fields |
| `$limit` | Restrict result count |
| `$skip` | Skip documents |
| `$lookup` | Join another collection |
| `$unwind` | Deconstruct an array field into separate documents |

---

# 14. Join Operations – $lookup

### Definition

The `$lookup` aggregation stage performs a left outer join between documents in the current collection and documents in another collection.

It is useful when related information is stored in separate collections.

### Example

Suppose the `students` collection contains:

```javascript
{
    name: "Vaishu",
    courseId: 1
}
```

The `courses` collection contains:

```javascript
{
    courseId: 1,
    courseName: "JavaScript",
    duration: "3 months"
}
```

### Step 1: Add courseId to the student

```javascript
db.students.updateOne(
    { name: "Vaishu" },
    {
        $set: {
            courseId: 1
        }
    }
)
```

### Step 2: Add courseId to the course

```javascript
db.courses.updateOne(
    { courseName: "JavaScript" },
    {
        $set: {
            courseId: 1
        }
    }
)
```

### Step 3: Perform the join

```javascript
db.students.aggregate([
    {
        $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "courseId",
            as: "courseDetails"
        }
    }
])
```

### Explanation

| Field | Purpose |
|---|---|
| `from` | Collection to join |
| `localField` | Matching field in the current collection |
| `foreignField` | Matching field in the other collection |
| `as` | Name of the resulting array |

The matching course documents are added to the student document under `courseDetails`.

---

# 15. Index Operations

### Definition

An index is a data structure that helps MongoDB locate documents efficiently without scanning every document in a collection.

Indexes improve query performance for suitable queries.

## 15.1 Create an Ascending Index

```javascript
db.students.createIndex({
    name: 1
})
```

## 15.2 Create a Descending Index

```javascript
db.students.createIndex({
    marks: -1
})
```

## 15.3 Create a Unique Index

```javascript
db.students.createIndex(
    { email: 1 },
    { unique: true }
)
```

A unique index prevents duplicate email values.

Ensure that existing documents satisfy the unique constraint before creating the index.

## 15.4 View Existing Indexes

```javascript
db.students.getIndexes()
```

## 15.5 Delete an Index

```javascript
db.students.dropIndex("name_1")
```

## 15.6 Analyze Query Execution

```javascript
db.students.find({
    name: "Vaishu"
}).explain("executionStats")
```

### Important points

- Indexes can improve query performance.
- Indexes require additional storage.
- Insert, update, and delete operations may become more expensive because indexes also need maintenance.
- Create indexes based on frequently used query patterns.

---

# 16. Collection Statistics and Management

| Command | Purpose |
|---|---|
| `db.createCollection("students")` | Create a collection |
| `show collections` | Display collections |
| `db.getCollectionNames()` | Get collection names |
| `db.students.renameCollection("learners")` | Rename a collection |
| `db.students.drop()` | Delete a collection |
| `db.stats()` | Display database statistics |
| `db.students.stats()` | Display collection statistics |
| `db.students.estimatedDocumentCount()` | Estimate document count |

### Example – Database statistics

```javascript
db.stats()
```

### Example – Collection statistics

```javascript
db.students.stats()
```

These commands provide information about database and collection storage, indexes, and document statistics.

---

# 17. Bulk Write Operations

### Definition

The `bulkWrite()` method allows multiple write operations to be performed on a single collection in one request.

Supported operations include:

- `insertOne`
- `updateOne`
- `updateMany`
- `replaceOne`
- `deleteOne`
- `deleteMany`

### Example

```javascript
db.students.bulkWrite([
    {
        insertOne: {
            document: {
                name: "Manoj",
                age: 22,
                marks: 80
            }
        }
    },
    {
        updateOne: {
            filter: { name: "Vaishu" },
            update: {
                $set: { marks: 95 }
            }
        }
    },
    {
        deleteOne: {
            filter: { name: "Ravi" }
        }
    }
])
```

### How it works

1. MongoDB receives an array of write operations.
2. Each operation specifies its own filter and data.
3. MongoDB executes the operations.
4. The result contains acknowledgement and operation counts.

### Purpose

- Execute multiple write operations together.
- Reduce the number of separate database requests.
- Efficiently process large sets of data.

---

# 18. MongoDB Shell Command Reference

| Category | Command | Purpose |
|---|---|---|
| Database | `show dbs` | Display databases |
| Database | `use collegeDB` | Switch or prepare a database |
| Database | `db` | Display current database |
| Database | `db.dropDatabase()` | Delete database |
| Collection | `db.createCollection()` | Create collection |
| Collection | `show collections` | Display collections |
| Collection | `db.students.drop()` | Delete collection |
| Insert | `insertOne()` | Insert one document |
| Insert | `insertMany()` | Insert multiple documents |
| Read | `find()` | Retrieve documents |
| Read | `findOne()` | Retrieve one document |
| Update | `updateOne()` | Update one document |
| Update | `updateMany()` | Update multiple documents |
| Update | `replaceOne()` | Replace a document |
| Delete | `deleteOne()` | Delete one document |
| Delete | `deleteMany()` | Delete multiple documents |
| Comparison | `$eq`, `$ne` | Equality filters |
| Comparison | `$gt`, `$gte` | Greater-than filters |
| Comparison | `$lt`, `$lte` | Less-than filters |
| Comparison | `$in`, `$nin` | Match or exclude values |
| Logical | `$and`, `$or` | Logical filtering |
| Logical | `$not`, `$nor` | Negation and NOR filtering |
| Element | `$exists`, `$type` | Field existence and type |
| Array | `$all`, `$size`, `$elemMatch` | Array filtering |
| Update | `$set`, `$unset` | Set or remove fields |
| Update | `$inc` | Increment numeric values |
| Update | `$push`, `$pull` | Add or remove array values |
| Projection | `find({}, {name: 1})` | Select specific fields |
| Sorting | `sort()` | Sort documents |
| Pagination | `skip()`, `limit()` | Control result pages |
| Count | `countDocuments()` | Count matching documents |
| Distinct | `distinct()` | Retrieve unique values |
| Aggregation | `$match` | Filter pipeline documents |
| Aggregation | `$group` | Group and calculate |
| Aggregation | `$project` | Transform output fields |
| Aggregation | `$sort`, `$limit` | Sort and restrict results |
| Join | `$lookup` | Join collections |
| Index | `createIndex()` | Create index |
| Index | `getIndexes()` | Display indexes |
| Index | `dropIndex()` | Delete index |
| Bulk | `bulkWrite()` | Execute multiple writes |


# 2_Install MongoDB Compass and Connect to a Local Database
## 1. Introduction

MongoDB Compass is an official graphical user interface (GUI) tool for MongoDB. It allows developers to interact with MongoDB databases without executing commands manually in the MongoDB Shell.

Using MongoDB Compass, we can create databases and collections, insert documents, retrieve records, update existing documents, delete documents, and execute queries through a visual interface.

## 2. Objectives

- Install MongoDB Compass on Windows.
- Understand the purpose of MongoDB Compass.
- Connect Compass to a local MongoDB server.
- Create a database and collection.
- Insert and view documents.
- Verify database operations using MongoDB Shell.

## 3. Download and Install MongoDB Compass

**Step 1: Download MongoDB Compass**

Visit the official MongoDB Compass download page:

https://www.mongodb.com/try/download/compass

Select the following options:

- Version: Latest
- Platform: Windows
- Package: MSI

Click **Download**.

**Step 2: Install MongoDB Compass**

1. Open the downloaded MSI installer.
2. Follow the installation wizard.
3. Accept the default installation settings.
4. Complete the installation.
5. Open MongoDB Compass from the Windows Start menu.

## 4. Verify MongoDB Server Installation

MongoDB Compass is a GUI application. It requires a running MongoDB server to connect to a local database.

Open Command Prompt and execute:

```cmd
mongod --version
```

This command displays the installed MongoDB server version.

Check the MongoDB Windows service:

```cmd
sc query MongoDB
```

If the service is installed but stopped, start it using:

```cmd
net start MongoDB
```

**Note:** If the MongoDB service does not exist, install MongoDB Community Server before attempting a local connection.

Official download: https://www.mongodb.com/try/download/community

## 5. Connect MongoDB Compass to the Local Database

After ensuring that MongoDB Server is running:

1. Open MongoDB Compass.
2. Select **New Connection**.
3. Enter the local MongoDB connection string:

```text
mongodb://127.0.0.1:27017
```

4. Click **Connect**.

**Connection String Explanation:**

| Component | Description |
|---|---|
| `mongodb://` | MongoDB connection protocol |
| `127.0.0.1` | Local machine IP address |
| `27017` | Default MongoDB server port |

If the connection is successful, Compass displays the available databases.

## 6. Create a Database and Collection

A database stores collections, and collections store documents.

**Steps:**

1. Click **Create Database**.
2. Enter the database name:

```text
studentDB
```

3. Enter the collection name:

```text
students
```

4. Click **Create Database**.

The database structure will be:

```text
studentDB
    |
    └── students
```

## 7. Insert Documents Using MongoDB Compass

Documents can be inserted directly through the Compass interface.

**Steps:**

1. Open the `studentDB` database.
2. Select the `students` collection.
3. Click **Add Data**.
4. Select **Insert Document**.
5. Enter the following JSON document:

```json
{
  "name": "Vaishu",
  "email": "vaishu@gmail.com",
  "age": 22,
  "city": "Coimbatore"
}
```

6. Click **Insert**.

The document is now stored in the `students` collection.

MongoDB automatically generates a unique `_id` field for the inserted document if one is not provided.

## 8. View Documents in MongoDB Compass

1. Open the `students` collection.
2. Navigate to the **Documents** tab.
3. View the inserted student document.

You can also filter documents using the Filter field.

Example:

```json
{
  "city": "Coimbatore"
}
```

This filter retrieves documents where the city field matches `Coimbatore`.

## 9. Verify Data Using MongoDB Shell

MongoDB Compass provides a visual interface, while MongoDB Shell (`mongosh`) allows database operations through commands.

Execute the following commands in `mongosh`:

**Select the database:**

```javascript
use studentDB
```

**Retrieve all student documents:**

```javascript
db.students.find()
```

**Retrieve a student by name:**

```javascript
db.students.findOne({
    name: "Vaishu"
})
```

The output should contain the inserted student document.

## 10. Common Connection Errors

| Error | Possible reason | Solution |
|---|---|---|
| `ECONNREFUSED 127.0.0.1:27017` | MongoDB server is not running | Start MongoDB Server |
| Connection timeout | Server is unavailable | Verify server status and port |
| MongoDB service does not exist | MongoDB Server is not installed as a Windows service | Install MongoDB Community Server |
| Authentication failed | Incorrect credentials | Verify authentication settings |

## 11. MongoDB Compass vs MongoDB Shell

| MongoDB Compass | MongoDB Shell |
|---|---|
| Graphical user interface | Command-line interface |
| Uses visual controls | Uses JavaScript-based commands |
| Displays documents visually | Displays query results as text |
| Suitable for visual database management | Suitable for scripting and command-based operations |
| Supports visual filtering and querying | Supports advanced query execution |

