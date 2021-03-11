import { Point } from "../Point.js";

// optimization suggested by Danny Mittal
function reorder(il,ir,lvl,in_idx,out_idx) {
    if(il>ir) return [];
    let mi=null;
    for(let i=il;i<=ir;++i) {
        if(mi==null||in_idx[i]<mi) mi=in_idx[i];
    }
    let found_x=[il-1];
    for(let i=il;i<=ir;++i) {
        if(in_idx[i]==mi) {found_x.push(i); out_idx[i]=lvl;}
    }
    found_x.push(ir+1);
    for(let i=1;i<found_x.length;++i) {
        let l=found_x[i-1]+1,r=found_x[i]-1;
        reorder(l,r,lvl+1,in_idx,out_idx);
    }
}

function FPTAlgo_x(points) {
    let t_start = performance.now();
    //sort points by y
    points.sort((a,b)=>a.y-b.y);
    let all_x=[];
    for(let pt of points) all_x.push(pt.x);
    all_x=[...new Set(all_x)].sort((a,b)=>a-b); // sort and unique
    // f stores state -> points to add
    // a state stores the level of each x, level 0: largest y, level inf: smallest y, etc.
    // we have to store the keys in Json
    const num_x=all_x.length;
    let x_id=new Map();
    for(let u=0;u<num_x;++u) x_id.set(all_x[u],u);
    let f=new Map();
    f.set(JSON.stringify(new Array(num_x).fill(0)),[]);
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
            const xid=x_id.get(x);
            const has_x=cur_x.has(x);
            let next_f=[];
            for(const [cur_xs,state,points] of cur_f) {
                let x_pos=state[xid];
                let pid=(cur_xs.length)?cur_xs[cur_xs.length-1]:-1;
                if(!has_x) { //do not place at x
                    let invalid=state[pid]>x_pos;
                    if(!invalid) next_f.push([cur_xs,state,points]);
                }
                if(true) { //place at x
                    let invalid=false;
                    for(let xi=pid+1;xi<xid;++xi) {
                        if(state[xi]<x_pos) {invalid=true; break;}
                    }
                    if(!invalid)
                        next_f.push([cur_xs.concat([xid]),state,has_x?points:(points.concat([new Point(x,y)]))]);
                }
            }
            cur_f=next_f;
        }
        f=new Map();
        for(const [cur_xs,state,points] of cur_f) {
            let next_state=[...state];
            for(let x of cur_xs) next_state[x]=-1;
            let out_state=[...next_state];
            reorder(0,num_x-1,0,next_state,out_state);
            next_state=JSON.stringify(out_state);
            // update f[next_state] with points
            if(f.has(next_state)&&f.get(next_state).length<=points.length) continue;
            f.set(next_state,points);
        }
    }
    let ans=null;
    for(const [_,points] of f) {
        if(ans==null||ans.length>points.length) ans=points;
    }
    let t_finish = performance.now();
    console.log("Took " + (t_finish - t_start) + " milliseconds, soln of size "+ans.length+".");
    return ans;
}

// points is a list of unique Points
// Returns a list of points to add
function FPTAlgo(points) {
    let all_x=[],all_y=[];
    for(let pt of points) {all_x.push(pt.x); all_y.push(pt.y);}
    if(new Set(all_x).size<new Set(all_y).size) return FPTAlgo_x(points);
    // swap x and y
    let points_rev=[];
    for(let pt of points) points_rev.push(new Point(pt.y,pt.x));
    let result_rev=FPTAlgo_x(points_rev),result=[];
    for(let pt of result_rev) result.push(new Point(pt.y,pt.x));
    return result;
}

export { FPTAlgo };