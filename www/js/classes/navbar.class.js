class Navbar extends Base {

  constructor(){
    super();
    this.items = [
      new NavbarItem('Startsida', '/'),
      new NavbarItem('Filmer','/filmer'),
      new NavbarItem('Kalendarium','/kalendarium'),
      new NavbarItem('Om oss','/om-oss'),
      new NavbarItem('Logga in','#login')

    ];
    this.setActive('/');
  }

  setActive(url){
    for(let item of this.items){
      item.active = url == item.url;
    }
    this.render();
  }
}