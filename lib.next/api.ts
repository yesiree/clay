


// const api = new Api('http://localhost:8080/api')

// const result = api
//   .list('/people')
//   .offset(10)
//   .limit(10)
//   .sortBy('title', 'asc', 'created', 'desc')
//   .where(ref => {
//     ref.and(ref => {
//       ref.or(ref => {
//         ref.where('title', '~', 'Business')
//         ref.where('region', '==', 'US')
//       })
//       ref.where('age', '>', 30)
//       ref.where('created', '>', new Date())
//       ref.or(ref => {
//         ref.where('city', '<in>', ['Provo', 'Orem'])
//         ref.where('tags', '<array-contains-any>', ['veggies', 'fruit', 'grain'])
//       })
//     })
//   })
//   .toString()

// const url = new URL(result)

// const where = url.searchParams.get('w')






// parse(where || '')
// console.log(where)
