export interface NFLTeam {
  id: string;
  city: string;
  name: string;
  abbreviation: string;
  primaryColor: string;
  secondaryColor: string;
  conference: 'AFC' | 'NFC';
  division: 'East' | 'North' | 'South' | 'West';
}

export const nflTeams: NFLTeam[] = [
  // AFC East
  { id: 'bills', city: 'Buffalo', name: 'Bills', abbreviation: 'BUF', primaryColor: '#00338D', secondaryColor: '#C60C30', conference: 'AFC', division: 'East' },
  { id: 'dolphins', city: 'Miami', name: 'Dolphins', abbreviation: 'MIA', primaryColor: '#008E97', secondaryColor: '#FC4C02', conference: 'AFC', division: 'East' },
  { id: 'patriots', city: 'New England', name: 'Patriots', abbreviation: 'NE', primaryColor: '#002244', secondaryColor: '#C60C30', conference: 'AFC', division: 'East' },
  { id: 'jets', city: 'New York', name: 'Jets', abbreviation: 'NYJ', primaryColor: '#125740', secondaryColor: '#FFFFFF', conference: 'AFC', division: 'East' },

  // AFC North
  { id: 'ravens', city: 'Baltimore', name: 'Ravens', abbreviation: 'BAL', primaryColor: '#241773', secondaryColor: '#9E7C0C', conference: 'AFC', division: 'North' },
  { id: 'bengals', city: 'Cincinnati', name: 'Bengals', abbreviation: 'CIN', primaryColor: '#FB4F14', secondaryColor: '#000000', conference: 'AFC', division: 'North' },
  { id: 'browns', city: 'Cleveland', name: 'Browns', abbreviation: 'CLE', primaryColor: '#FF3C00', secondaryColor: '#362D00', conference: 'AFC', division: 'North' },
  { id: 'steelers', city: 'Pittsburgh', name: 'Steelers', abbreviation: 'PIT', primaryColor: '#FFB612', secondaryColor: '#101820', conference: 'AFC', division: 'North' },

  // AFC South
  { id: 'texans', city: 'Houston', name: 'Texans', abbreviation: 'HOU', primaryColor: '#03202F', secondaryColor: '#A71930', conference: 'AFC', division: 'South' },
  { id: 'colts', city: 'Indianapolis', name: 'Colts', abbreviation: 'IND', primaryColor: '#002C5F', secondaryColor: '#A2AAAD', conference: 'AFC', division: 'South' },
  { id: 'jaguars', city: 'Jacksonville', name: 'Jaguars', abbreviation: 'JAX', primaryColor: '#101820', secondaryColor: '#D7A22A', conference: 'AFC', division: 'South' },
  { id: 'titans', city: 'Tennessee', name: 'Titans', abbreviation: 'TEN', primaryColor: '#0C2340', secondaryColor: '#4B92DB', conference: 'AFC', division: 'South' },

  // AFC West
  { id: 'broncos', city: 'Denver', name: 'Broncos', abbreviation: 'DEN', primaryColor: '#FB4F14', secondaryColor: '#002244', conference: 'AFC', division: 'West' },
  { id: 'chiefs', city: 'Kansas City', name: 'Chiefs', abbreviation: 'KC', primaryColor: '#E31837', secondaryColor: '#FFB81C', conference: 'AFC', division: 'West' },
  { id: 'raiders', city: 'Las Vegas', name: 'Raiders', abbreviation: 'LV', primaryColor: '#000000', secondaryColor: '#A5ACAF', conference: 'AFC', division: 'West' },
  { id: 'chargers', city: 'Los Angeles', name: 'Chargers', abbreviation: 'LAC', primaryColor: '#0080C6', secondaryColor: '#FFC20E', conference: 'AFC', division: 'West' },

  // NFC East
  { id: 'cowboys', city: 'Dallas', name: 'Cowboys', abbreviation: 'DAL', primaryColor: '#003594', secondaryColor: '#869397', conference: 'NFC', division: 'East' },
  { id: 'giants', city: 'New York', name: 'Giants', abbreviation: 'NYG', primaryColor: '#0B2265', secondaryColor: '#A71930', conference: 'NFC', division: 'East' },
  { id: 'eagles', city: 'Philadelphia', name: 'Eagles', abbreviation: 'PHI', primaryColor: '#004C54', secondaryColor: '#A5ACAF', conference: 'NFC', division: 'East' },
  { id: 'commanders', city: 'Washington', name: 'Commanders', abbreviation: 'WAS', primaryColor: '#5A1414', secondaryColor: '#FFB612', conference: 'NFC', division: 'East' },

  // NFC North
  { id: 'bears', city: 'Chicago', name: 'Bears', abbreviation: 'CHI', primaryColor: '#0B162A', secondaryColor: '#C83803', conference: 'NFC', division: 'North' },
  { id: 'lions', city: 'Detroit', name: 'Lions', abbreviation: 'DET', primaryColor: '#0076B6', secondaryColor: '#B0B7BC', conference: 'NFC', division: 'North' },
  { id: 'packers', city: 'Green Bay', name: 'Packers', abbreviation: 'GB', primaryColor: '#203731', secondaryColor: '#FFB612', conference: 'NFC', division: 'North' },
  { id: 'vikings', city: 'Minnesota', name: 'Vikings', abbreviation: 'MIN', primaryColor: '#4F2683', secondaryColor: '#FFC62F', conference: 'NFC', division: 'North' },

  // NFC South
  { id: 'falcons', city: 'Atlanta', name: 'Falcons', abbreviation: 'ATL', primaryColor: '#A71930', secondaryColor: '#000000', conference: 'NFC', division: 'South' },
  { id: 'panthers', city: 'Carolina', name: 'Panthers', abbreviation: 'CAR', primaryColor: '#0085CA', secondaryColor: '#101820', conference: 'NFC', division: 'South' },
  { id: 'saints', city: 'New Orleans', name: 'Saints', abbreviation: 'NO', primaryColor: '#101820', secondaryColor: '#D3BC8D', conference: 'NFC', division: 'South' },
  { id: 'buccaneers', city: 'Tampa Bay', name: 'Buccaneers', abbreviation: 'TB', primaryColor: '#D50A0A', secondaryColor: '#FF7900', conference: 'NFC', division: 'South' },

  // NFC West
  { id: 'cardinals', city: 'Arizona', name: 'Cardinals', abbreviation: 'ARI', primaryColor: '#97233F', secondaryColor: '#000000', conference: 'NFC', division: 'West' },
  { id: 'rams', city: 'Los Angeles', name: 'Rams', abbreviation: 'LAR', primaryColor: '#003594', secondaryColor: '#FFA300', conference: 'NFC', division: 'West' },
  { id: '49ers', city: 'San Francisco', name: '49ers', abbreviation: 'SF', primaryColor: '#AA0000', secondaryColor: '#B3995D', conference: 'NFC', division: 'West' },
  { id: 'seahawks', city: 'Seattle', name: 'Seahawks', abbreviation: 'SEA', primaryColor: '#002244', secondaryColor: '#69BE28', conference: 'NFC', division: 'West' }
];
