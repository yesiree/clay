# Clay

A mock backend for quick prototyping.

# Components

  - Ping
    - GET   /ping

  - Auth
    - POS   /auth/login
    - GET   /auth/refresh

    - GET   /auth/users
    - GET   /auth/users/:id
    - POS   /auth/users
    - PUT   /auth/users/:id
    - PAT   /auth/users/:id
    - DEL   /auth/users/:id

    - GET   /auth/users/:id/scopes
    - POS   /auth/users/:id/scopes
    - PUT   /auth/users/:id/scopes
    - PAT   /auth/users/:id/scopes
    - PUT   /auth/users/:id/scopes/:scope
    - DEL   /auth/users/:id/scopes/:scope

    - GET   /auth/roles
    - POS   /auth/roles
    - PUT   /auth/roles
    - PAT   /auth/roles
    - DEL   /auth/roles/:role

    - GET   /auth/rules
    - POS   /auth/rules
    - PAT   /auth/rules
    - PUT   /auth/rules/:rule
    - DEL   /auth/rules/:rule

  - API
    - GET   /api/search/:list ? ...
    - POS   /api/search/:list
    - PUT   /api/search/:list/:id
    - PAT   /api/search/:list/:id
    - DEL   /api/search/:list/:id

    - GET   /api/rules
    - POS   /api/rules
    - GET   /api/rules/:rule
    - PUT   /api/rules/:rule
    - PAT   /api/rules/:rule
    - DEL   /api/rules/:rule

    - GET   /api/data/:path/:id ? expand=field1,field2
    - POS   /api/data/:path/:id
    - PUT   /api/data/:path/:id
    - PAT   /api/data/:path/:id
    - DEL   /api/data/:path/:id

  - Content???
    - GET   /content/:meta[image,private,public,doc]???/:path
    - DEL   /content/:meta[image,private,public,doc]???/:path
    - GET   /content/:meta[image,private,public,doc]???/:path/:id ? s w h g...
    - PUT   /content/:meta[image,private,public,doc]???/:path/:id
    - DEL   /content/:meta[image,private,public,doc]???/:path/:id
