Deploy instructions
====

- deployments are set up using <https://www.npmjs.com/deploy>
- follow the instructions there to add the `deploy` remote, then you can do `git push deploy master` to push the master branch to the hosted server.
- After the push completes the [update](./update) script will be run on the hosted server.
