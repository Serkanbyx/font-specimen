# Security policy

## Reporting a vulnerability

Please do not open a public issue for security problems. Use GitHub's private vulnerability reporting instead: open the repository's **Security** tab and choose **Report a vulnerability**.

Include what you found, how to reproduce it and what an attacker could achieve. You should get a first reply within a week.

## Scope

Font Specimen is a static, client-only application. Relevant reports include:

- script injection through project data, imported JSON or share links (`#/share/…`);
- ways to make the app send data to another origin;
- bypasses of the Content Security Policy shipped in the production build;
- denial of service through crafted share links (for example decompression bombs) beyond the existing size limits.

Font files themselves and their upstream sources are out of scope; report problems with a typeface to its authors.

## Supported versions

Only the latest commit on the default branch is supported.
