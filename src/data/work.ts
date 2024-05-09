import { Colors } from '../styles';

export interface StyleData {
  navigationBar: {
    fullWidth: {
      backgroundColor: string;
      foregroundColor: string;
    };
    mobile: {
      backgroundColor: string;
      foregroundColor: string;
    };
  };
}

export interface WorkPlace {
  id: string;
  name: string;
  url: string;
  style: StyleData | null;
}

export const workPlaces: WorkPlace[] = [
  {
    id: '',
    name: '⌂ JPHOLT.DEV',
    url: 'intro',
    style: null,
  },
  {
    id: 'phaidra',
    name: 'Phaidra',
    url: 'phaidra',
    style: {
      navigationBar: {
        fullWidth: {
          backgroundColor: Colors.White.toHexString,
          foregroundColor: Colors.Black.toHexString,
        },
        mobile: {
          backgroundColor: Colors.White.toHexString,
          foregroundColor: Colors.Black.toHexString,
        },
      },
    },
  },
  {
    id: 'google-health',
    name: 'Google Health',
    url: 'google-health',
    style: {
      navigationBar: {
        fullWidth: {
          backgroundColor: Colors.Black.toHexString,
          foregroundColor: Colors.White.toHexString,
        },
        mobile: {
          backgroundColor: Colors.Black.toHexString,
          foregroundColor: Colors.White.toHexString,
        },
      },
    },
  },
  {
    id: 'deepmind',
    name: 'DeepMind',
    url: 'deepmind',
    style: {
      navigationBar: {
        fullWidth: {
          backgroundColor: Colors.Blue.toHexString,
          foregroundColor: Colors.White.toHexString,
        },
        mobile: {
          backgroundColor: Colors.White.toHexString,
          foregroundColor: Colors.Black.toHexString,
        },
      },
    },
  },
  {
    id: 'channel4',
    name: 'Channel 4',
    url: 'channel4',
    style: {
      navigationBar: {
        fullWidth: {
          backgroundColor: Colors.Purple.toHexString,
          foregroundColor: Colors.White.toHexString,
        },
        mobile: {
          backgroundColor: Colors.Black.toHexString,
          foregroundColor: Colors.White.toHexString,
        },
      },
    },
  },
  {
    id: 'nokia',
    name: 'Nokia',
    url: 'nokia',
    style: {
      navigationBar: {
        fullWidth: {
          backgroundColor: Colors.White.toHexString,
          foregroundColor: Colors.Black.toHexString,
        },
        mobile: {
          backgroundColor: Colors.White.toHexString,
          foregroundColor: Colors.Black.toHexString,
        },
      },
    },
  },
  {
    id: 'symbian',
    name: 'Symbian',
    url: 'symbian',
    style: {
      navigationBar: {
        fullWidth: {
          backgroundColor: Colors.Black.toHexString,
          foregroundColor: Colors.White.toHexString,
        },
        mobile: {
          backgroundColor: Colors.Black.toHexString,
          foregroundColor: Colors.White.toHexString,
        },
      },
    },
  },
  {
    id: 'bmg',
    name: 'BMG',
    url: 'bmg',
    style: {
      navigationBar: {
        fullWidth: {
          backgroundColor: Colors.White.toHexString,
          foregroundColor: Colors.Black.toHexString,
        },
        mobile: {
          backgroundColor: Colors.White.toHexString,
          foregroundColor: Colors.Black.toHexString,
        },
      },
    },
  },
];
