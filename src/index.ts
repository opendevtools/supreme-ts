import commander from 'commander';

const program = new commander.Command();

program.version('1');

program
  .command('create')
  .alias('c')
  .description('Create a new app')
  .option('-a, --app <type>', 'What app setup to use')
  .action(cmd => {
    console.log(cmd.app);
  });

program.parse(process.argv);
