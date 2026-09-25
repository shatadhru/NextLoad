import type { CollectionConfig } from 'payload'
import adminOnly from '../access/adminOnly'
import roleAccess from '../access/roleAccess'

export const PersonalData: CollectionConfig = {



  slug: 'personaldata',


  access: {
    read: adminOnly,
    update: adminOnly , 
    create: roleAccess(['admin', 'user'])
  },


  admin: {
    group: "Bhaiya"
  },


  fields: [

{
    name: "name",
    label: "Name",
    type: "text",
    required: true
},

{
    name: "selectrole",
    label: "Role Select",
    type: "select",
    options : [
        {
            value: "admin",
            label: "Admin"
        },
        {
            value: "user",
            label: "user"
        },
        {
            value: "me",
            label: "me"
        },
        {
            value: "you",
            label: "you"
        }
    ]
}




  ],
}
