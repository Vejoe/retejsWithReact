import Rete from 'rete';

// 创建自定义的描述控制
class DescriptionControl extends Rete.Control {
  constructor(emitter, key, node) {
    super(key);
    this.render = 'html'; // 使用 HTML 渲染
    this.key = key;
    this.emitter = emitter;
    this.node = node;
    this.template = `<div class="description">{{ description }}</div>`;
    this.scope = {
      description: node.data.description
    };
  }
}

class MyComponent extends Rete.Component {
  constructor() {
    super('My Component');
  }

  builder(node) {
    node.data.description = 'This is a custom description for the node';

    const inp = new Rete.Input('in', 'Input', numSocket);
    const out = new Rete.Output('out', 'Output', numSocket);

    // 添加自定义的描述控制
    node.addControl(new DescriptionControl(this.editor, 'description', node));

    return node
      .addInput(inp)
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    // 节点的工作逻辑
  }
}
