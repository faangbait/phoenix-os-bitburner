# phoenix-os-bitburner

So after investigation and discussion, it looks like the _root_ of the most of the bugs boils down to how bitburner imports modules. Objects, classes, etc are _duplicated_, rather than _referenced_ by imports.

It's the modular structure itself that causes untraceable bugs.

Could be solved by consolidating everything into one script, but I'm worried usability would suffer. Probably best to just copy and paste the chunks of this you want into your own scripts... and keep it in one file.

## This package is deprecated.

Current state has been pushed to dev/sf4/refactor branches, but they may or may not work as intended.
