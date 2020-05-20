import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as d3 from "d3";

interface HierarchyDatum {
  name: string;
  value: number;
  children?: Array<HierarchyDatum>;
}

const data: HierarchyDatum = {
  name: "A1",
  value: 100,
  children: [
    {
      name: "B1",
      value: 100,
      children: [
        {
          name: "C1",
          value: 100,
          children: undefined
        },
        {
          name: "C2",
          value: 300,
          children: [
            {
              name: "D1",
              value: 100,
              children: undefined
            },
            {
              name: "D2",
              value: 300,
              children: undefined
            }
          ]
        },
        {
          name: "C3",
          value: 200,
          children: undefined
        }
      ]
    },
    {
      name: "B2",
      value: 200,
      children: [
        {
          name: "C4",
          value: 100,
          children: undefined
        },
        {
          name: "C5",
          value: 300,
          children: undefined
        },
        {
          name: "C6",
          value: 200,
          children: [
            {
              name: "D3",
              value: 100,
              children: undefined
            },
            {
              name: "D4",
              value: 300,
              children: undefined
            }
          ]
        }
      ]
    }
  ]
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'd3tree';
  @ViewChild('chart', { static: true }) private chartContainer: ElementRef;


  root: any;
  tree: any;
  treeLayout: any;
  svg: any;

  treeData: any;

  height: number;
  width: number;
  margin: any = { top: 200, bottom: 90, left: 100, right: 90 };
  duration: number = 750;
  nodeWidth: number = 5;
  nodeHeight: number = 5;
  nodeRadius: number = 5;
  horizontalSeparationBetweenNodes: number = 5;
  verticalSeparationBetweenNodes: number = 5;
  nodeTextDistanceY: string = "-5px";
  nodeTextDistanceX: number = 5;

  dragStarted: boolean;
  draggingNode: any;
  nodes: any[];
  selectedNodeByDrag: any;

  selectedNodeByClick: any;
  previousClickedDomNode: any;
  links: any;

  constructor() { }

  ngOnInit() {
    this.renderTreeChart();
  }

  renderTreeChart() {

    let element: any = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight)
      .append("g")
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // declares a tree layout and assigns the size
    this.tree = d3.tree()
      .size([this.height, this.width])
      .nodeSize([this.nodeWidth + this.horizontalSeparationBetweenNodes, this.nodeHeight + this.verticalSeparationBetweenNodes])
      .separation((a, b) => { return a.parent == b.parent ? 5 : 10 });

    // Assigns parent, children, height, depth
    this.root = d3.hierarchy(data, (d) => { return d.children; });
    this.root.x0 = this.height / 2;
    this.root.y0 = 10;

    // Collapse after the second level
    //this.root.children.forEach(collapse);

    this.updateChart(this.root);

    // function collapse(d) {
    //   if (d.children) {
    //       d._children = d.children;
    //       d._children.forEach(collapse);
    //       d.children = null;
    //   }
    // }

  }

  click = (d) => {
    console.log('click');
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.updateChart(d);
  }

  updateChart(source) {
    let i = 0;
    console.log(source);
    this.treeData = this.tree(this.root);
    this.nodes = this.treeData.descendants();
    this.links = this.treeData.descendants().slice(1);
    this.nodes.forEach((d) => { d.y = d.depth * 180 });

    let node = this.svg.selectAll('g.node')
      .data(this.nodes, (d) => { return d.id || (d.id = ++i); });

    let nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d) => {
        return 'translate(' + source.y0 + ',' + source.x0 + ')';
      })
      .on('click', this.click);

    nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style('fill', (d) => {
        return d._children ? 'lightsteelblue' : '#fff';
      });

    nodeEnter.append('text')
      .attr('dy', '.35em')
      .attr('x', (d) => {
        return d.children || d._children ? -13 : 13;
      })
      .attr('text-anchor', (d) => {
        return d.children || d._children ? 'end' : 'start';
      })
      .style('font', '12px sans-serif')
      .text((d) => { return d.data.name; });

    let nodeUpdate = nodeEnter.merge(node);

    nodeUpdate.transition()
      .duration(this.duration)
      .attr('transform', (d) => {
        return 'translate(' + d.y + ',' + d.x + ')';
      });

    nodeUpdate.select('circle.node')
      .attr('r', 10)
      .style('stroke-width', '3px')
      .style('stroke', 'steelblue')
      .style('fill', (d) => {
        return d._children ? 'lightsteelblue' : '#fff';
      })
      .attr('cursor', 'pointer');

    let nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr('transform', (d) => {
        return 'translate(' + source.y + ',' + source.x + ')';
      })
      .remove();

    nodeExit.select('circle')
      .attr('r', 1e-6);

    nodeExit.select('text')
      .style('fill-opacity', 1e-6);

    let link = this.svg.selectAll('path.link')
      .data(this.links, (d) => { return d.id; });

    let linkEnter = link.enter().insert('path', 'g')
      .attr('class', 'link')
      .style('fill', 'none')
      .style('stroke', '#ccc')
      .style('stroke-width', '2px')
      .attr('d', function (d) {
        let o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      });

    let linkUpdate = linkEnter.merge(link);

    linkUpdate.transition()
      .duration(this.duration)
      .attr('d', (d) => { return diagonal(d, d.parent); });

    let linkExit = link.exit().transition()
      .duration(this.duration)
      .attr('d', function (d) {
        let o = { x: source.x, y: source.y };
        return diagonal(o, o);
      })
      .remove();

    this.nodes.forEach((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    function diagonal(s, d) {
      let path = `M ${s.y} ${s.x}
                  C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
      return path;
    }
  }

}
