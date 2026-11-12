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



# 5_MongoDB Performance Testing – Insert 50 Users into Local MongoDB and Atlas

## 2. What is Database Insertion?

Database insertion is the process of adding new documents into a MongoDB collection.

MongoDB provides different insertion methods:

- `insertOne()` – Inserts a single document.
- `insertMany()` – Inserts multiple documents.

In this task, `insertMany()` is used to insert 50 user documents in one operation.

## 3. Why Insert Multiple Documents?

In real-world applications, multiple records may need to be stored together.

Examples:

- Importing customer records.
- Registering multiple users.
- Uploading product information.
- Migrating data from one database to another.
- Loading initial application data.

Instead of executing 50 separate insertion operations, `insertMany()` allows multiple documents to be submitted in a single operation.

## 4. Concepts Used

### 4.1 generateUsers()

**What is it?**

`generateUsers()` is a custom JavaScript function that generates 50 user documents dynamically.

**Why is it used?**

Performance testing requires a dataset to perform insertion operations.

Generating the documents programmatically avoids manually creating 50 user records.

The function uses:

```javascript
Array.from({ length: TOTAL_USERS }, (_, index) => {
    // Generate each user document
});
```

This creates an array containing 50 user objects.

Each document contains:

- Name
- Email
- Age
- City
- Created date

### 4.2 Why Generate Users Only Once?

The generated user array is passed to both local MongoDB and Atlas.

```javascript
const users = generateUsers();
```

The same array is reused for both insertion operations.

**Purpose:**

It ensures both environments receive the same dataset, making the comparison more consistent.

The unique timestamp in the email address also helps avoid duplicate email values when the test is executed again.

### 4.3 insertMany()

**What is it?**

`insertMany()` is a MongoDB collection method used to insert multiple documents in a single operation.

**Why is it used?**

It reduces the need to execute separate insertion requests for every document.

Example:

```javascript
const result = await collection.insertMany(users);
```

Here:

- `collection` identifies the target collection.
- `users` contains the 50 documents.
- `result` contains information about the insertion operation.

### 4.4 insertedCount

**What is it?**

`insertedCount` indicates how many documents were successfully inserted by the operation.

Example:

```javascript
console.log("Users inserted:", result.insertedCount);
```

Expected value:

```text
Users inserted: 50
```

It helps verify whether the insertion operation completed successfully.

### 4.5 performance.now()

**What is it?**

`performance.now()` measures the duration of the insertion operation using a high-resolution timer.

**Why is it used?**

It allows us to compare how long local MongoDB and Atlas take to insert the same set of documents.

Example:

```javascript
const startTime = performance.now();

const result = await collection.insertMany(users);

const endTime = performance.now();

const insertionTime = endTime - startTime;
```

The difference between the timestamps gives the measured insertion duration in milliseconds.

### 4.6 Separate Database Connections

The application creates separate MongoDB clients for local MongoDB and Atlas.

```javascript
const client = new MongoClient(connectionString);
```

**Why is this required?**

Each database environment has its own connection string and server.

The application connects to one environment, performs the insertion, closes its connection, and then performs the operation in the other environment.

### 4.7 Error Handling

The application uses `try...catch...finally` to manage insertion failures.

**try:**

- Connect to the database.
- Select the database and collection.
- Insert the 50 documents.
- Calculate insertion time.

**catch:**

Handles problems such as:

- Connection failures.
- Authentication failures.
- Duplicate key errors.
- Database insertion errors.

**finally:**

Closes the MongoDB client regardless of whether insertion succeeds or fails.

## 5. Performance Comparison

After inserting the documents into both environments, their insertion times are compared.

Example output:

```text
MongoDB Performance Testing
Total users: 50

Connected to Local MongoDB

Local Insertion Results
Users inserted: 50
Insertion time: 12.45 ms

Connected to Atlas MongoDB

Atlas Insertion Results
Users inserted: 50
Insertion time: 85.32 ms

========== PERFORMANCE COMPARISON ==========

Local MongoDB: 12.45 ms
MongoDB Atlas: 85.32 ms

Local MongoDB was faster.
```

### Possible outcomes

**Case 1: Local MongoDB is faster**

Local MongoDB may complete insertion faster because it does not require communication with a remote cloud server.

**Case 2: MongoDB Atlas is faster**

Atlas may complete insertion faster due to differences in server hardware, network conditions, storage performance and load.

**Case 3: Similar execution times**

Both environments may take approximately the same time.

**Important:** The results of one run are not sufficient to conclude that one database is always faster. Repeat the test under consistent conditions.
## 7. Real-World Importance

Bulk insertion is useful in applications that need to store many records efficiently.

Examples:

- Importing customer data from external systems.
- Initializing application databases.
- Migrating records between databases.
- Bulk uploading products or services.
- Processing large datasets.
Performance testing helps developers evaluate the time required to insert data and choose suitable database configurations.

**Important measurement limitation:** Your timer measures the duration of the `insertMany()` operation as observed by the Node.js application. It includes network communication for Atlas, server processing and acknowledgement. It is not a measurement of MongoDB's internal storage-engine time alone.


# 6_MongoDB Performance Testing – Fetch Users from Local MongoDB and Atlas
## 2. What is Database Fetching?

Database fetching is the process of retrieving existing documents from a MongoDB collection.

MongoDB provides different methods to retrieve documents:

- `find()` – Retrieves documents matching a condition.
- `findOne()` – Retrieves a single matching document.
- `find().toArray()` – Retrieves matching documents and converts the cursor into an array.

In this task, `find({})` is used to retrieve all documents from the users collection.

## 3. Why Compare Local MongoDB and MongoDB Atlas?

MongoDB can be hosted in different environments.

**Local MongoDB:**

- Runs on the developer's computer.
- Database communication happens through the local machine.
- Does not require an internet connection for database access.
- Usually has lower network communication overhead.

**MongoDB Atlas:**

- Runs on cloud infrastructure.
- Database communication happens over a network.
- Requires internet connectivity.
- Performance can be affected by network latency and cloud infrastructure.

Comparing both environments helps us understand the difference between local and cloud database access.

## 4. Concepts Used

### 4.1 MongoClient

**What is it?**

`MongoClient` is a class provided by the MongoDB Node.js Driver to establish communication between a Node.js application and MongoDB.

**Why is it used?**

A Node.js application needs a database connection before performing database operations.

**How does it work?**

The connection string specifies the database server and authentication details. `MongoClient` uses that information to establish a connection.

### 4.2 Environment Variables

**What are they?**

Environment variables store configuration values outside the application source code.

**Why are they used?**

Local MongoDB and Atlas require different connection strings. Instead of hardcoding them in JavaScript, they are stored in `.env`.

Example:

```env
LOCAL_MONGO_URI=mongodb://127.0.0.1:27017
ATLAS_MONGO_URI=your_atlas_connection_string
```

The application reads the appropriate connection string depending on the environment.

### 4.3 MongoDB Database and Collection

```javascript
const database = client.db(DATABASE_NAME);
const collection = database.collection(COLLECTION_NAME);
```

- `client.db()` selects the database.
- `database.collection()` selects the collection.

In this task:

- Database: `performanceDB`
- Collection: `users`

### 4.4 find()

**What is it?**

`find()` is a MongoDB method used to retrieve documents from a collection.

**Why is it used?**

It allows an application to retrieve multiple documents based on specified conditions.

Example:

```javascript
collection.find({})
```

The empty filter `{}` means all documents should be retrieved.

### 4.5 toArray()

**What is it?**

`find()` returns a cursor rather than an ordinary JavaScript array.

`toArray()` consumes the cursor and converts the retrieved documents into an array.

Example:

```javascript
const users = await collection.find({}).toArray();
```

After execution, `users` contains the retrieved documents.

### 4.6 performance.now()

**What is it?**

`performance.now()` is a high-resolution timer provided by Node.js through the `perf_hooks` module.

**Why is it used?**

It measures the time taken by an operation more precisely than using ordinary date timestamps.

Example:

```javascript
const startTime = performance.now();

const users = await collection.find({}).toArray();

const endTime = performance.now();

const queryTime = endTime - startTime;
```

The difference between the start and end time represents the measured fetch duration.

### 4.7 count and Query Execution Time

Two important values are measured:

- Total users fetched: Number of documents retrieved.
- Query execution time: Time taken by the measured retrieval operation, in milliseconds.

These values help compare the two database environments.

### 4.8 Error Handling

The `try...catch...finally` structure is used to handle connection and retrieval errors.

- `try`: Connects to MongoDB and retrieves documents.
- `catch`: Handles connection or query errors.
- `finally`: Closes the MongoDB client.

This prevents database failures from being silently ignored and ensures resource cleanup.

## 5. Performance Comparison
After retrieving documents from both environments, the application compares their execution times.

Possible outcomes:
**Case 1: Local MongoDB is faster**
Local database access took less measured time than Atlas access.
A possible reason is lower network communication overhead.
**Case 2: MongoDB Atlas is faster**
Atlas completed the measured retrieval faster in that particular test.
Possible reasons include differences in hardware, caching, network conditions and server load.
**Case 3: Similar execution times**
Both environments completed the operation in approximately the same time.

**Important:** A single execution does not establish that one environment is always faster. Repeated tests with the same dataset and conditions provide a more reliable comparison.

## 7. Real-World Importance

Database performance testing helps developers understand how efficiently an application retrieves data.

It is useful when:

- Comparing local and cloud database environments.
- Evaluating database response time.
- Identifying network-related performance overhead.
- Testing application behaviour with larger datasets.
- Making infrastructure and deployment decisions.
**Important measurement limitation:** Your timer starts immediately before `find().toArray()` and stops immediately afterward. It measures the complete cursor retrieval operation, including the time needed to receive and materialize the results. It does not measure only the MongoDB server's internal query execution time.

# 7_Network Failure and Error Handling
## 1. What is Network Failure?

Network failure occurs when a Node.js application cannot communicate with the MongoDB database server.

In a real-world application, Node.js needs a network connection to MongoDB Atlas to perform database operations such as:

- Inserting documents
- Retrieving documents
- Updating documents
- Deleting documents

If the connection fails, database operations cannot be completed.

Network failure simulation helps us understand how an application behaves when MongoDB is unavailable and how to handle errors without unexpectedly terminating the application.

## 2. Types of Errors

### 2.1 DNS Resolution Failure – ENOTFOUND

**What is it?**

DNS (Domain Name System) is responsible for converting a domain name into an IP address.

When Node.js connects to MongoDB Atlas, it needs to resolve the Atlas hostname to locate the database server.

`ENOTFOUND` occurs when DNS cannot find or resolve the requested hostname.

**Why does it happen?**

1. The MongoDB Atlas hostname is incorrect.
2. The hostname does not exist.
3. DNS resolution is unavailable.
4. There is a DNS configuration or connectivity problem.

**Real-time scenario:**

Suppose an application uses this MongoDB connection string:

```javascript
mongodb+srv://user:password@invalidcluster.mongodb.net/
```

If `invalidcluster.mongodb.net` cannot be resolved, Node.js cannot locate the MongoDB server.

**How to handle it?**

- Verify the MongoDB Atlas connection string.
- Check whether the cluster hostname is correct.
- Check internet connectivity.
- Check DNS resolution.
- Catch the connection error and display a meaningful message.

**Example error handling:**

```javascript
if (error.code === "ENOTFOUND") {
    console.log("DNS resolution failed.");
    console.log("Check the MongoDB hostname.");
}
```

**Purpose of handling:**

Instead of terminating the application unexpectedly, the application informs the developer that the database hostname could not be resolved.

---

### 2.2 Connection Refused – ECONNREFUSED

**What is it?**

`ECONNREFUSED` occurs when an application attempts to establish a connection with a server, but the destination refuses the connection.

The destination may be reachable, but it is not accepting connections on the requested port.

**Why does it happen?**

1. MongoDB server is not running.
2. The application connects to an incorrect port.
3. The destination service is not listening.
4. A firewall or network configuration actively rejects the connection.

**Real-time scenario:**

Suppose MongoDB is expected to run locally on port `27017`, but the MongoDB service is stopped.

Node.js attempts to connect:

```javascript
mongodb://127.0.0.1:27017/
```

Since no MongoDB server is listening on that port, the connection can be refused.

**How to handle it?**

- Check whether the MongoDB service is running.
- Verify the hostname and port.
- Check firewall and network configurations.
- Retry the connection after the database service becomes available.
- Catch the connection error and display an appropriate message.

**Example error handling:**

```javascript
if (error.code === "ECONNREFUSED") {
    console.log("MongoDB connection was refused.");
    console.log("Check whether the database server is running.");
}
```

**Purpose of handling:**

It helps identify whether the destination database service is accepting connections and prevents connection failures from being treated as successful operations.

---

### 2.3 Authentication Failure – MongoDB Error Code 18

**What is it?**

Authentication is the process of verifying the identity of a user before allowing access to MongoDB.

MongoDB Atlas requires valid database credentials when authentication is enabled.

Error code `18` represents an authentication failure.

**Why does it happen?**

1. Incorrect MongoDB database username.
2. Incorrect password.
3. Database user does not exist.
4. Authentication configuration is incorrect.

**Real-time scenario:**

Suppose an application uses the following credentials:

```text
Username: wrong_user
Password: wrong_password
```

MongoDB Atlas receives the connection request but rejects the credentials.

Therefore, the application cannot authenticate and access the database.

**How to handle it?**

- Verify the database username.
- Verify the password.
- Check Database Access in MongoDB Atlas.
- Verify the authentication configuration.
- Avoid displaying database passwords in application logs.

**Example error handling:**

```javascript
if (error.code === 18) {
    console.log("MongoDB authentication failed.");
    console.log("Check database username and password.");
}
```

**Purpose of handling:**

It helps distinguish authentication problems from network connectivity problems and prevents unauthorized database access.

---

## 3. MongoServerSelectionError

**What is it?**

`MongoServerSelectionError` occurs when the MongoDB driver cannot find a suitable MongoDB server within the configured server selection timeout.

The driver attempts to identify an available server before executing database operations.

**Why does it happen?**

- MongoDB Atlas is unavailable.
- The IP address is not included in Atlas Network Access.
- Network connectivity is blocked.
- DNS resolution fails.
- The database server is unreachable.
- The server selection timeout expires.

**How to handle it?**

1. Verify the MongoDB connection string.
2. Check Atlas Network Access.
3. Verify internet connectivity.
4. Check the underlying error and its cause.
5. Configure a suitable server selection timeout.

**Example:**

```javascript
const client = new MongoClient(connectionString, {
    serverSelectionTimeoutMS: 5000
});
```

The timeout is configured to 5 seconds. If the driver cannot select a suitable server within that time, the connection attempt fails.

**Important distinction:**

`MongoServerSelectionError` is a higher-level driver error. The underlying cause may be `ENOTFOUND`, `ECONNREFUSED`, a timeout, or another connectivity problem. They are related, but they are not interchangeable.

---

## 4. Unexpected Database Errors

**What is it?**

An unexpected database error is an error that does not match the specific conditions handled by the application.

**Why does it happen?**

- Database command failures.
- Insufficient database permissions.
- Invalid database operations.
- Unexpected MongoDB server errors.

**How to handle it?**

Use a general `else` condition or default error handler to catch errors that are not explicitly classified.

```javascript
else {
    console.log("An unexpected database error occurred.");
}
```

This ensures that unclassified errors are not silently ignored.

---

## 5. Why do we use try, catch and finally?

These three blocks help manage database operations and failures.

### try

Contains the operations that may produce errors.

Example:

```javascript
await client.connect();
await database.command({ ping: 1 });
```

### catch

Executes when an error occurs in the corresponding `try` block.

It is used to:

- Identify the error.
- Display meaningful error messages.
- Handle known errors separately.
- Prevent unhandled promise rejections.

### finally

Executes whether the operation succeeds or fails.

Example:

```javascript
finally {
    await client.close();
}
```

Its purpose is to release database client resources and clean up the connection.

## 6. Error Comparison

| Error | Main purpose of identification | Common cause |
|---|---|---|
| ENOTFOUND | Identify DNS resolution problems | Invalid hostname |
| ECONNREFUSED | Identify refused connections | Service not listening |
| Error code 18 | Identify authentication problems | Incorrect credentials |
| MongoServerSelectionError | Identify server selection failures | Server unavailable or unreachable |
| Unexpected error | Handle unclassified failures | Other database errors |


## 8. Real-World Importance

In production applications, MongoDB connections may fail because of network interruptions, server maintenance, incorrect credentials or infrastructure problems.

Proper error handling helps developers:

- Identify the actual reason for database failures.
- Avoid exposing sensitive credentials.
- Display meaningful error messages.
- Log errors for debugging.
- Retry temporary failures when appropriate.
- Clean up database resources.
- Improve application reliability.