# Dotfiles

Installation:

```bash
mkdir $HOME/git

git clone --bare git@git.mrugacz.xyz:mrugacz/dotfiles.git $HOME/git/dotfiles

function config {
   /usr/bin/git --git-dir=$HOME/git/dotfiles/ --work-tree=$HOME $@
}

mkdir -p .config-backup

config checkout

if [ $? = 0 ]; then
  echo "Checked out config.";
  else
    echo "Backing up pre-existing dot files.";
    config checkout 2>&1 | egrep "\s+\." | awk {'print $1'} | xargs -I{} mv {} .config-backup/{}
fi;

config checkout
config config status.showUntrackedFiles no

# enable bluetooth media controls
sudo systemctl daemon-reload
systemctl --user enable --now mpris-proxy.service
```
