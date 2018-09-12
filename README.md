# clay
A simple mock backend for building prototypes

The idea behind this is to provide a simple and powerful backend that just does what backends do out of the box. Of course, it won't scale—and that's the trade-off. Currently, it offers the following:
 - Authentication & Authorization using JWTs
 - Persistent storage via RESOURCEful APIs
  - Support for common HTTP methods (GET, POST, PUT, PATCH, DELETE)
  - Flexible querying
    - Full text search
    - LIKE/contains/Wildcard
    - Regular expressions
    - Less than, greater than, equal to, etc.
    - Boolean comparison