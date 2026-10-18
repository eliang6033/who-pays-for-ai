import test from 'node:test';
import assert from 'node:assert/strict';
import {scenePoint} from '../src/placement.js';
const rect={left:100,top:50,right:900,bottom:550,width:800,height:500};
test('outside drops are rejected, including zero-sized hidden scenes',()=>{for(const [x,y] of [[99,200],[901,200],[400,49],[400,551]])assert.equal(scenePoint(x,y,rect),null);assert.equal(scenePoint(100,50,{...rect,width:0}),null);});
test('placement is normalized for responsive scenes and clamped away from clipped edges',()=>{assert.deepEqual(scenePoint(500,300,rect),{x:50,y:50});assert.deepEqual(scenePoint(100,50,rect),{x:12,y:18});assert.deepEqual(scenePoint(900,550,rect),{x:88,y:78});assert.deepEqual(scenePoint(200,150,{left:0,top:0,width:400,height:300,right:400,bottom:300}),{x:50,y:50});});
