export type QueryOperator =
  '==' |                      // equal to
  '!=' |                      // not equal to
  '<' |                       // less than
  '<=' |                      // less than or equal to
  '>' |                       // greater than
  '>=' |                      // greater than or equal to
  '=*' |                      // starts with
  '*=' |                      // ends with
  '*' |                       // contains
  '~' |                       // full text search match
  '<in>' |                    // value is in array
  '<not-in>' |                // value is not in array
  '<array-contains-any>' |    // array contains any
  '<array-contains-all>'      // array contains all
