## Firebase

1. Create `keys.ts` file at the root of `src` folder by copying `keys-demo.ts` file and put firebase project configuration there.
2. Enable Google Sign In Firebase Authentication
3. Enable Email Authentication in Firebase Console
4. Update `.firebaserc` file with `projectId`

## Microsoft Academic Knowledge API

https://msr-apis.portal.azure-api.net/products/project-academic-knowledge
https://docs.microsoft.com/en-gb/academic-services/project-academic-knowledge/reference-interpret-method

```
firebase functions:config:set MS_KNOWLEDGE_API_SECONDARY_KEY=""
```

Login --> Create Update Users Collection --> Create User Context at protected route level

/admin/users
/admin/groups
/admin/elections
/admin/placements

## Tasks

[] Sign Up

- User already exists
- Success message
- Redirect to login Screen

[] Forgot Password
