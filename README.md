
![Switchable Repo Banner](https://i.loli.net/2019/08/23/RfVzYBXqv6N5mOx.png)

### What is it

Create amount of daily plans, then quickly switch from one to another.

### License

MPL v2.0

### Before Build

Copy `src/assets/example_leancloud.json` to `src/assets/leancloud.json` and modify the columns as the tip says. If you allows `clients to create classes` (Go to your app at Leancloud, click LeanStorage, click Settings, than disselect `Disallow clients to create classes`), we'll be able to set up all the things automatically, but because it is unsafe, after development, turn that down.

### Build Setup

``` bash
# install dependencies
yarn

# build for electron using capacitor (default only mac, support mac, win & linux)
yarn run e

# build for android using capacitor
yarn run c

# build for web into docs/ (we use docs/ to serve github pages)
yarn run w

```
