export class ItemType {
  name?: string;
  description?: string;
  id?:string;

  constructor(
        name: string,
        description?: string,
        id?: string
    )
  {
  	this.name = name;
  	this.description = description;
  	this.id = id;
  }
}

export let items: ItemType[] = [
  { name: 'Board', description: 'Two panel black chalk board.' },
  { name: 'Smart board', description: 'Interactive whiteboard.' },
  { name: 'Projector', description: 'Beamer projector with VGA and HDMI ports.' }
];
