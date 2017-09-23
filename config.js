module.exports = {
	inventoryFile: '/etc/ansible/hosts',
	groups: ['servers','backupNodes'],
	resultsDirectory: __dirname + '/results',
	runsDirectory: __dirname + '/runs',

};
