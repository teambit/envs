import Helper from 'bit-bin/dist/e2e-helper/e2e-helper';
import path from 'path';

describe('vue compiler', () => {
  let helper: Helper;
  beforeAll(() => {
    process.env.DEBUG = 'true';
    helper = new Helper();
  });
  beforeEach(() => {
    helper.scopeHelper.reInitLocalScope();
  });

  afterAll(() => {
    helper.scopeHelper.destroy();
  });

  it('should compile a simple Vue component', () => {
    const COMP_ID = 'hello-world';
    FILES.forEach(f => {
      helper.fs.createFile(f.folder, f.name, f.content);
    });
    helper.command.addComponent('src', { i: COMP_ID, m: 'src/helloWorld.vue', t: 'src/helloWorld.spec.ts' });
    const bitJson = helper.bitJson.read();
    (bitJson.env = {
      compiler: {
        meta: {
          options: {
            file: path.join(__dirname, '../dist/index.js')
          }
        }
      }
    }),
      helper.bitJson.write(bitJson);
    helper.command.build(COMP_ID);
    expect(helper.fs.getConsumerFiles('dist/*.*')).toEqual([
      'dist/demo.html',
      'dist/hello-world.common.js',
      'dist/hello-world.umd.js',
      'dist/hello-world.umd.min.js'
    ]);
  });
});

const FILES = [
  {
    folder: 'src',
    name: 'helloWorld.vue',
    content: `
    <template>
        <div class="hello">
        <h1>{{ msg }}</h1>
        <h3>Installed CLI Plugins</h3>
        <ul>
            <li>
            <a href="https://router.vuejs.org" target="_blank" rel="noopener"
                >vue-router</a
            >
            </li>
        </ul>
        </div>
    </template>
    
    <script>
    import './HelloWorld.css';
    export default {
        name: "HelloWorld",
        props: {
        msg: String
        }
    };
    </script>
    
    <style scoped>
    h3 {
        margin: 40px 0 0;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    a {
        color: #42b983;
    }
    </style>
  }
  `
  },
  {
    folder: 'src',
    name: 'helloWorld.spec.ts',
    test: true,
    content: ''
  },
  {
    folder: 'src',
    name: 'HelloWorld.css',
    content: 'h1{ background: azure; }'
  }
];
