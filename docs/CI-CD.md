# Shoplane CI/CD walkthrough

## Default: simplest deployment

Push source to main. GitHub Actions installs dependencies, checks syntax, runs isolated
API tests, builds the frontend (including asset checks), and runs Playwright checkout
and mobile tests. The browser test also checks a real product photograph loads.
Vercel's Git integration deploys independently. This default is easy to configure,
but a failing Actions test does not block a Vercel Git deployment.

## Optional: deploy only after tests pass

The included deploy job uses needs: verify. It runs only for main pushes/manual runs,
never pull requests, and only when repository variable VERCEL_CD_ENABLED is true.
The old Render deployment job is replaced by a Vercel job in this ZIP.

1. Configure the Vercel project and production environment using START-HERE.md.
2. Add repository Actions secrets VERCEL_TOKEN, VERCEL_ORG_ID and VERCEL_PROJECT_ID
   from your Vercel account/project. These are account settings, not source edits.
3. Set repository variable VERCEL_CD_ENABLED=true.
4. Disconnect automatic Git deployment for this project if Actions must be the only
   production deployment path. Keep the existing Vercel project/domain; do not delete it.
5. If deployment protection blocks automated health checks, configure Vercel's
   automation bypass secret and add VERCEL_AUTOMATION_BYPASS_SECRET to Actions secrets.
6. Push a commit or run the workflow manually on main.

After verification, the pinned Vercel CLI deploys the checked-out revision. A runtime
SHOPLANE_COMMIT identifies that exact commit. The final step checks /api/health for
both status ok and the expected SHA. The database URI remains in Vercel's environment;
tests use an isolated temporary replica set and never access customer data.

A deployment can build successfully while MongoDB credentials or network access fail.
The health check catches that case and fails the job. It reports failure; it does not
automatically roll back a deployment. Rate limits and Mongo connection pools are per
instance; scaling to larger traffic requires shared rate limiting and pool monitoring.

## Demonstration for the internship

Show a PR test run, the passed checks, a main branch run with the deploy job, then the
live website and health endpoint. Explain a test failure preventing the dependent
job. Do not claim gated CD is active until its secrets/variable are configured and
an actual run succeeds. Publish your walkthrough and record the demo after validating
the live app; this ZIP does not publish to social media.

References:
- https://vercel.com/docs/cli/deploy
- https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow
