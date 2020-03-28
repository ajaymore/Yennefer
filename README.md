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

## Libraries

1. React https://reactjs.org/
2. Fluent UI https://developer.microsoft.com/en-us/fluentui#/controls/web
3. Formik https://jaredpalmer.com/formik/docs/overview
4. Yup https://github.com/jquense/yup
5. Firebase https://firebase.google.com/docs/web/setup
6. React Router https://reacttraining.com/react-router/web/guides/quick-start
7. React Lottie https://github.com/chenqingspring/react-lottie
8. React Spring https://www.react-spring.io/

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
