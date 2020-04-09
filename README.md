1. Show current users groups
2. Allow removal of existing groups
3. Add more groups to current groups

election
posts

/elections
Form Name, Date, Description -> Election
Display all Elections, name is a link
/elections/:id
Form Post - Post Name
Display all the posts (Box format) | Edit post name, remove Post

```
<ProtectedRoute path="/elections">

<Route exact path={path} /> -> Election display and edit
<ROute path={`${paht}/:id`}> -> Post display & Edit

```

collection election -> name, date, description, posts
