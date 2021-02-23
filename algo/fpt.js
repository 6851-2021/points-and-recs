import { Point } from "../Point.js";

function merge_layers(cur_layers,new_layers) {
    for(var u=0;u<cur_layers.length;++u) {
        if(u<new_layers.length) new_layers[u]=new_layers[u].concat(cur_layers[u]);
        else new_layers.push(cur_layers[u]);
    }
}

function tidyup_idx(list_x,idx) {
    if(!list_x.length) return [];
    let mi=null;
    for(const x of list_x) {
        if(mi==null||idx.get(x)<mi) mi=idx.get(x);
    }
    var found_x=[],stash_x=[],new_layers=[];
    for(const x of list_x) {
        if(idx.get(x)==mi) {
            merge_layers(tidyup_idx(stash_x,idx),new_layers);
            found_x.push(x); stash_x=[];
        }
        else stash_x.push(x);
    }
    merge_layers(tidyup_idx(stash_x,idx),new_layers);
    new_layers.unshift(found_x);
    return new_layers;
}

// optimization suggested by Danny Mittal
function tidyup(list_x,layers) {
    var idx=new Map();
    for(var u=0;u<layers.length;++u) {
        for(const x of layers[u]) idx.set(x,u);
    }
    return tidyup_idx(list_x,idx);
}

function FPTAlgo_(points) {
    var t_start = performance.now();
    //sort points by y
    points.sort((a,b)=>a.y-b.y);
    let all_x=[];
    for(let pt of points) all_x.push(pt.x);
    all_x=[...new Set(all_x)].sort((a,b)=>a-b); // sort and unique
    // f stores state -> points to add
    // a state is an array of arrays, each array represents equal elements, in decreasing order of y
    // we have to store the key in Json
    let f=new Map();
    f.set(JSON.stringify([all_x]),[]);
    for(let il=0,ir;il<points.length;il=ir+1) {
        ir=il;
        while(ir+1<points.length&&points[ir+1].y===points[il].y) ++ir;
        const y=points[il].y; //points [il...ir] has .y equals to y
        let cur_x=[];
        for(let i=il;i<=ir;++i) cur_x.push(points[i].x);
        cur_x=new Set(cur_x);
        let cur_f=[];
        for(const [state, points] of f) {
            cur_f.push([[],JSON.parse(state),points]);
        }
        for(const x of all_x) {
            const has_x=cur_x.has(x);
            let next_f=[];
            for(const [cur_xs,state,points] of cur_f) {
                let x_pos=null;
                for(var u=0;u<state.length;++u) {
                    if(state[u].indexOf(x)!=-1) {x_pos=u; break;}
                }
                let prev_x=(cur_xs.length)?cur_xs[cur_xs.length-1]:-1;
                if(!has_x) { //do not place at x
                    let invalid=false;
                    for(var u=x_pos+1;u<state.length;++u) {
                        if(state[u].indexOf(prev_x)!=-1) {invalid=true; break;}
                    }
                    if(!invalid) next_f.push([cur_xs,state,points]);
                }
                if(true) { //place at x
                    let invalid=false;
                    for(var u=0;u<x_pos;++u) {
                        for(const obs_x of state[u]) {
                            if(obs_x>prev_x&&obs_x<x) {invalid=true; break;}
                        }
                        if(invalid) break;
                    }
                    if(!invalid)
                        next_f.push([cur_xs.concat([x]),state,has_x?points:(points.concat([new Point(x,y)]))]);
                }
            }
            cur_f=next_f;
        }
        f=new Map();
        for(const [cur_xs,state,points] of cur_f) {
            let next_state=[cur_xs].concat(state);
            for(const x of cur_xs) {
                for(var u=1;u<next_state.length;++u) {
                    const idx=next_state[u].indexOf(x);
                    if(idx==-1) continue;
                    // cloning
                    var nxt_u=[...next_state[u]];
                    nxt_u.splice(idx,1);
                    next_state[u]=nxt_u;
                }
            }
            next_state=next_state.filter(el=>el!=[]);
            next_state=tidyup(all_x,next_state);
            next_state=JSON.stringify(next_state);
            // update f[next_state] with points
            if(f.has(next_state)&&f.get(next_state).length<=points.length) continue;
            f.set(next_state,points);
        }
    }
    var ans=null;
    for(const [_,points] of f) {
        if(ans==null||ans.length>points.length) ans=points;
    }
    var t_finish = performance.now();
    console.log("Took " + (t_finish - t_start) + " milliseconds, soln of size "+ans.length+".");
    return ans;
}

// points is a list of unique Points
// Returns a list of points to add
function FPTAlgo(points) {
    let all_x=[],all_y=[];
    for(let pt of points) {all_x.push(pt.x); all_y.push(pt.y);}
    if(new Set(all_x).size<new Set(all_y).size) return FPTAlgo_(points);
    // swap x and y
    let points_rev=[];
    for(let pt of points) points_rev.push(new Point(pt.y,pt.x));
    let result_rev=FPTAlgo_(points_rev),result=[];
    for(let pt of result_rev) result.push(new Point(pt.y,pt.x));
    return result;
}

export { FPTAlgo };