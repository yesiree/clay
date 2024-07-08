


/*

  collections [
    collection {
      path /people
      docs [
        doc {
          $path /people/:id
          $id 123
          name Trevor
          department Software Engineering
        }
      ]
    }
  ]


  docs [
    doc {
      $path: '/people/123',
      $id: '123',
      name: 'Trevor',
      department: 'abc'
    }
    doc {
      $path: '/departments/abc',
      $id: 'abc',
      name: 'Math'
    }
  ]







  Example URLs

  // Valid Characters: a-z A-Z 0-9 . - _ ~ ! $ & ' ( ) * + , ; = : @

  api
    .list('/resource')
    .offset(0)
    .limit(10)
    .orderBy('field1', 'desc')
    .where('field1', '==', 'value')
    .filter(ref => {
      ref.and(ref => {
        ref
          .where(...)
          .where(...)
          .or(ref => {
            ref.where(...)
            ref.where(...)
          })
      })
    })
    .search('all the terms', 'field1', 'field2', ...)
    .search('all the terms', {
      field1: 2,
      field2: 1
    })

  api.get('/resource/')

  api.post('/resource', {...})
  api.put('/resource', {...})
  api.patch('/resource', {...})
  api.delete('/resource', {...})

  /api/resource?
    list=[0,10]
    query=all+the+terms
    fields=field1,boost;field2,boost;
    filter=field1,op,value
    filter=field2,op,value
    order=field1,asc;field2,desc;


  GET     /api/resource
  POST    /api/resource
  PUT     /api/resource
  PATCH   /api/resource
  DELETE  /api/resource

          /auth/signin
          /auth/signout
          /auth/users
          /auth/users/:userId
          /auth/users/:userId/roles
          /auth/users/:userId/roles/:role
          /auth/users/:userId/roles/:role/permissions
          /auth/users/:userId/roles/:role/permissions/:permission
          /auth/roles
          /auth/roles/:role
          /auth/roles/:role/permissions
          /auth/roles/:role/permissions/:permission

  module.exports = {
    'resource': {
      create(value) {

      },
      update(oldValue, newValue) {

      },
      write(oldValue, newValue, type) {

      },
      remove(oldValue) {

      }
    }
  }

*/
