# posts

Add `.md` files to this directory and register them in `posts.json` to add a post.

## Example

```json
  {
    "title": "NTP Server Configuration",
    "date": "08-04-2014",
    "excerpt": "A brief guide to the Network Time Protocol and its configuration.",
    "filename": "2014-08-04-NTP_Configuration"
  }
```

## Planned Features

### `project`

Boolean denoting whether the given post is a project. Projects would be handled differently by adding a nav menu item for the project.

### `tags`

Currently a hold over from the original [Jekyll](https://jekyllrb.com/) site on GitHub Pages. I want to reimplement this later for navigation.

### `comments`

Another [Jekyll](https://jekyllrb.com/) remnant. This enabled [Disqus](https://disqus.com/) comments.
