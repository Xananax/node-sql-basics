
const args = process.argv.slice(2)
const command = args[0]

if(command == 'add'){
  const name = args[1];
  const genre = args[2];

  if(!name){
    console.error('you have to provide a name')
    process.exit()
  }
  if(!genre){
    console.error('you have to provide a genre')
    process.exit()
  }
  insert( name, genre );
}
else if(command == 'list'){
  list();
}else{
  console.error('I do not know this command')
}