import { createRoot } from "react-dom/client";
import { NodeEditor, GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets
} from "rete-connection-plugin";
import { ReactPlugin, Presets, ReactArea2D } from "rete-react-plugin";
import { StyledNode } from "./StyledNode";
import { addCustomBackground } from "./custom-background";
import { exportGraph } from "./ExportToJSON";

import { StartNode } from "./customNode/StartNode/StartNode";
import { StartNodeConnection } from "./customNode/StartNode/StartNodeConnection";
import { StartNodeSocket } from "./customNode/StartNode/StartNodeSocket";

import { AuthenticationNode } from "./customNode/AuthenticationNode/AuthenticationNode";

type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
type AreaExtra = ReactArea2D<Schemes>;

export async function createEditor(container: HTMLElement) {
  const socket = new ClassicPreset.Socket("socket");

  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  });

  render.addPreset(
    Presets.classic.setup({
      customize: {
        node(context) {

          if (context.payload.label === "Override styles") {
            return StyledNode;
          }
          if (context.payload.label === "StartNode") {
            return StartNode;
          }
          if (context.payload.label === "AuthenticationNode") {
            return AuthenticationNode;
          }
          return Presets.classic.Node;
        },
        socket(context) {
          return StartNodeSocket;
        },
        connection(context) {
          return StartNodeConnection;
        }
      }
    })
  );

  connection.addPreset(ConnectionPresets.classic.setup());

  addCustomBackground(area);

  editor.use(area);
  area.use(connection);
  area.use(render);

  AreaExtensions.simpleNodesOrder(area);

  const startNode = new ClassicPreset.Node("StartNode");
  startNode.addOutput("success", new ClassicPreset.Output(socket, "Next", false));
  await editor.addNode(startNode);


  const usernameNode = new ClassicPreset.Node("AuthenticationNode");
  usernameNode.addInput("input", new ClassicPreset.Input(socket));
  usernameNode.addOutput("success", new ClassicPreset.Output(socket,"success", false));
  usernameNode.addOutput("fail", new ClassicPreset.Output(socket,"fail", false));
  usernameNode.addControl("expression", new ClassicPreset.InputControl("text", {}));
  usernameNode.addControl("description", new ClassicPreset.InputControl("text", {}));
  usernameNode.addControl("nodeName", new ClassicPreset.InputControl("text", {
    initial: 0,
    readonly: false,
    change(value) { }
  }))
  console.log("============usernameNode=============")
  console.log(JSON.stringify(usernameNode));
  console.log("============usernameNode=============")
  await editor.addNode(usernameNode);



  const usernameNode2 = new ClassicPreset.Node("AuthenticationNode");
  usernameNode2.addInput("input", new ClassicPreset.Input(socket));
  usernameNode2.addOutput("success", new ClassicPreset.Output(socket,"success", false));
  usernameNode2.addOutput("fail", new ClassicPreset.Output(socket,"fail", false));
  usernameNode2.addControl("expression", new ClassicPreset.InputControl("text", {}));
  usernameNode2.addControl("description", new ClassicPreset.InputControl("text", {}));
  usernameNode2.addControl("nodeName", new ClassicPreset.InputControl("text", {
    initial: 0,
    readonly: false,
    change(value) { }
  }))
  console.log("============usernameNode=============")
  console.log(JSON.stringify(usernameNode2));
  console.log("============usernameNode=============")
  await editor.addNode(usernameNode2);

  await area.translate(startNode.id, { x: 0, y: 0 });
  await area.translate(usernameNode.id, { x: 500, y: 0 });

  await editor.addConnection(new ClassicPreset.Connection(startNode, "success", usernameNode, "input"));
  console.log(JSON.stringify(await exportGraph(editor)));

  setTimeout(() => {
    AreaExtensions.zoomAt(area, editor.getNodes());
  }, 100);



  return {
    destroy: () => area.destroy()
  };

}
