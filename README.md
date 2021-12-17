# 111 online prototypes
Design prototypes for 111 online project

Note this is prototype code. Not intended for production use.

Get up and running in 5 minutes

1. Clone this repo using `git clone [repo_Github_URL] [local_dir]`

2. Move into the local copy `cd [local_dir]`

3. Add all the ingredients `npm install`

4. Run it `grunt`

5. Look at it in your browser `http://localhost:3000/`

* You’ll probably want to detach from this repo to create your own at this point, so use `git remote rm origin` to remove this repo and and either create a new one on github.com in a browser or use `gh repo create` - once you've done that use `git remote add origin https://github.com/NHS-DUEC/my-new-repo.git` to add it as a new remote for your prototype. Now do a quick `git push origin main` and you‘ll see the contents of your new prototype fill the empty repo. Good job!

6. Make a branch `git checkout -b myFeature`

7. Do some work. You can find some examples on this page `http://localhost:3000/examples`

8. Happy? Make a commit `git add .` and `git commit -m "new feature is cool"`

9. Push your work to github `git push origin myFeature`

10. Merge it on github

11. Put it somewhere so other people can look at it `heroku create` and

12. `git push heroku main` all done!

13. Everyone happy? Switch back to main `git checkout main` and tidy up `git branch -D myFeature`

## Troubleshooting
No `git`? Install Xcode tools from Apple

Error seeing the repo on github?
You probably need to install Github CLI tools and login.
Use `brew install gh` and then `gh auth login` and input the verification code from the terminal on the web.

No `grunt`? Install with `brew install grunt`

No `brew`? Install from https://brew.sh
