# Brew-Keeper-gui

This is a re-working of the [front-end code developed by Shay Hall and David
White](https://github.com/Brew-Keeper/brew-keeper-gui) for our final project at
The Iron Yard in Durham, NC in November of 2015. Kathleen Rauh and I developed
the Brew-Keeper [back-end in
Python](https://github.com/Brew-Keeper/brew-keeper-api).

This project is live at
[https://brewkeeper-52a9a.firebaseapp.com](https://brewkeeper-52a9a.firebaseapp.com).

## Project Goals and Successes Achieved

### Implement Best Practices

The initial goal was to implement the Angular best practices, as described
in [John Papa's Angular
styleguide](https://github.com/johnpapa/angular-styleguide/tree/master/a1). I
have completed this portion of the project.

Best Practices Implementation Highlights:

- [x] Data service that (1) wraps Angular's `$http` methods, inserting the base
  url and needing only the uri, (2) defines the base url for the API (making it
  trivially easy to switch between development and production back-ends), and
  (3) manages the username and credentials used to connect to the API.

- [x] Recipe service that caches recipes to prevent unnecessary calls to the API.

- [x] Reduce calls to the API as much as possible. Prime examples being the
  add, delete, and update methods for steps and brew notes on the user recipe
  detail page, which have been updated to make the changes only and not
  re-acquire the recipe after the change.

### Update Sass/CSS

I updated several Sass files to be more concise and predictable, implementing
the BEM style (although not yet throughout) and reducing specificity wherever
possible.

Also, I replaced ~7500 lines of compiled CSS with 16 lines—yay CSS variables!

### New Features

- [x] **Log in less frequently.** With the new order caching in place, the app is
  now lightening fast; however, one of the biggest time savers is having the
  authentication cookie last for 30 days.

- [x] **New uri structure.** To better set up for future features and communicate
  better to the user where they are in the app, the uri structure has been
  modified (e.g., `/users/{username}/recipes` instead of `/{username}` and
  `/users/{username}/recipes/{recipe_id}/brewit` instead of
  `/{username}/{recipe_id}/brewit`).

- [x] **More uniform styling.** Display of elements within the UI (headers, stars,
  spacing, etc.) are now sharing the same underlying styling and more
  consistent html markup.

- [x] **More brews!** Slightly smaller stars on the user recipe list allow for
  4-digit brew counts to stay on the same line at 375px (iPhone 6 width).
