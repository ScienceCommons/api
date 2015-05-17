* Fork https://github.com/ScienceCommons/api.git (backend) and https://github.com/ScienceCommons/www (frontend)
* Create a feature branch named it after the issue you are working on, e.g. issue#42. Check out your branch. Commit often.
* Create rspec unit tests for each Ruby method you write
* Run the app locally and perform manual regression steps outlined in https://github.com/ScienceCommons/api/blob/master/UI-regression-tests.MD
* When rspec unit tests and manual regression tests are passing, create a pull request with `staging` branches of `www` and `api` repos as targets.
* CurateScience core team will review your code changes and merge your pull request into `staging`. TravisCI will automatically deploy `staging` to https://curatescience-staging.herokuapp.com/beta for User Acceptance Testing
* When your changes pass UAT, CurateScience core team will merge `staging` into `master` and TravisCI will auto-deploy to production at https://www.curatescience.org/beta
